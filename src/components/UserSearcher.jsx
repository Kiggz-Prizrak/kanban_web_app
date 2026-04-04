import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7007/api";

const DEBOUNCE_MS = 350;
const PAGE_SIZE = 10;

// ===========================
// SÉCURITÉ — escapeRegex pour le highlight local uniquement
// La recherche elle-même est faite côté serveur via LIKE Sequelize
// ===========================
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ===========================
// Highlight sécurisé — JSX pur, pas de dangerouslySetInnerHTML
// ===========================
const HighlightedText = ({ text, term }) => {
  if (!term.trim()) return <span>{text}</span>;

  let regex;
  try {
    regex = new RegExp(`(${escapeRegex(term)})`, "gi");
  } catch {
    return <span>{text}</span>;
  }

  const parts = text.split(regex);
  // reset entre chaque appel — regex stateful avec flag g
  regex.lastIndex = 0;

  return (
    <span>
      {parts.map((part, i) => {
        const isMatch = new RegExp(`^${escapeRegex(term)}$`, "i").test(part);
        return isMatch ? (
          <mark key={i} className="search_highlight">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
};

// ===========================
// PAGINATION — serveur
// ===========================
const Pagination = ({ currentPage, totalPages, onPageChange, theme }) => {
  if (totalPages <= 1) return null;

  // Fenêtre glissante : max 5 pages affichées
  const range = [];
  const delta = 2;
  const left = Math.max(1, currentPage - delta);
  const right = Math.min(totalPages, currentPage + delta);

  for (let i = left; i <= right; i++) range.push(i);

  return (
    <div className="search_pagination">
      <button
        className={`search_page_btn search_page_btn--${theme}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {left > 1 && (
        <>
          <button
            className={`search_page_btn search_page_btn--${theme}`}
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {left > 2 && <span className="search_page_ellipsis">…</span>}
        </>
      )}

      {range.map((page) => (
        <button
          key={page}
          className={`search_page_btn search_page_btn--${theme} ${
            page === currentPage ? "search_page_btn--active" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {right < totalPages && (
        <>
          {right < totalPages - 1 && (
            <span className="search_page_ellipsis">…</span>
          )}
          <button
            className={`search_page_btn search_page_btn--${theme}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={`search_page_btn search_page_btn--${theme}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  );
};

// ===========================
// HOOK — recherche debouncée avec AbortController
// Annule la requête précédente si l'user tape vite
// ===========================
const useUserSearch = ({ term, page, excludeIds }) => {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref pour l'AbortController — survit aux re-renders
  const abortRef = useRef(null);
  // Ref pour le timer debounce
  const timerRef = useRef(null);

  const search = useCallback(() => {
    // Annule la requête en cours si elle existe
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      q: term,
      page: String(page),
      limit: String(PAGE_SIZE),
    });

    fetch(`${API_URL}/users/search?${params}`, {
      credentials: "include",
      headers: { Accept: "application/json" },
      signal: abortRef.current.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Filtre côté client les ids déjà membres
        const filtered = (data.users ?? []).filter(
          (u) => !excludeIds.includes(u.id),
        );
        const excludedCount = (data.users ?? []).length - filtered.length;

        setResults(filtered);
        // Soustrait les exclus du total serveur pour un compteur cohérent
        setTotal(Math.max(0, (data.total ?? 0) - excludedCount));
        setTotalPages(data.totalPages ?? 0);
      })
      .catch((err) => {
        // AbortError = requête annulée volontairement — pas une vraie erreur
        if (err.name === "AbortError") return;
        setError("Erreur lors de la recherche");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [term, page, excludeIds]);

  useEffect(() => {
    // Debounce — attend DEBOUNCE_MS avant de lancer la requête
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(search, DEBOUNCE_MS);

    return () => {
      clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, [search]);

  return { results, total, totalPages, isLoading, error };
};

// ===========================
// COMPOSANT PRINCIPAL
// ===========================
const UserSearcher = ({
  onSelect,
  theme = "darkmode",
  // ids des membres déjà présents — filtrés côté client après la réponse API
  excludeIds = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);

  // Debounce local du terme pour l'affichage du highlight
  // (le hook gère le debounce réseau séparément)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset page à 1 quand le terme change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const { results, total, totalPages, isLoading, error } = useUserSearch({
    term: debouncedTerm,
    page: currentPage,
    excludeIds,
  });

  const handleClear = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    inputRef.current?.focus();
  };

  return (
    <div className={`user_searcher user_searcher--${theme}`}>
      {/* Barre de recherche */}
      <div className="search_bar_wrapper">
        <div
          className={`search_input_container search_input_container--${theme}`}
        >
          {isLoading ? (
            <svg
              className="search_icon search_icon--spinning"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg
              className="search_icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}

          <input
            ref={inputRef}
            type="text"
            className={`search_input search_input--${theme}`}
            placeholder="Rechercher par username ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            maxLength={100}
          />

          {searchTerm && (
            <button
              type="button"
              className="search_clear_btn"
              onClick={handleClear}
              aria-label="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Compteur / état */}
      {error ? (
        <p className="errorMessage">{error}</p>
      ) : (
        <p className="search_count">
          {isLoading
            ? "Recherche..."
            : total === 0
              ? debouncedTerm
                ? `Aucun résultat pour "${debouncedTerm}"`
                : "Tapez pour rechercher un utilisateur"
              : `${total} résultat${total > 1 ? "s" : ""}${
                  debouncedTerm ? ` pour "${debouncedTerm}"` : ""
                }`}
        </p>
      )}

      {/* Résultats */}
      <ul className="search_results">
        {results.map((user) => (
          <li
            key={user.id}
            className={`search_result_item search_result_item--${theme}`}
          >
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.username}
                className="search_result_avatar"
              />
            )}

            <div className="search_result_info">
              <p className="search_result_username">
                <HighlightedText text={user.username} term={debouncedTerm} />
              </p>
              {user.email && (
                <p className="search_result_email">
                  <HighlightedText text={user.email} term={debouncedTerm} />
                </p>
              )}
            </div>

            {onSelect && (
              <button
                type="button"
                className="form_button_submit search_select_btn"
                onClick={() => onSelect(user)}
              >
                Inviter
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination serveur */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        theme={theme}
      />
    </div>
  );
};

export default UserSearcher;
