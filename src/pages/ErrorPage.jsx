import {
  useRouteError,
  useNavigate,
  isRouteErrorResponse,
} from "react-router-dom";
import { useSelector } from "react-redux";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.currentTheme);

  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const is401 = isRouteErrorResponse(error) && error.status === 401;

  const title = is404
    ? "Page introuvable"
    : is401
      ? "Non autorisé"
      : "Une erreur est survenue";

  const message = is404
    ? "La page que tu cherches n'existe pas."
    : is401
      ? "Tu n'as pas accès à cette page."
      : error?.message || "Erreur inattendue.";

  return (
    <main className={`main_container main_container--${theme}`}>
      <section className="auth_container auth_card modal_container modal_container--darkmode">
        <div className="auth_card_content">
          <div className="auth_header">
            <h1>{title}</h1>
            <p>{message}</p>
            {!is401 && (
              <p style={{ color: "#828FA3", fontSize: "0.8rem", marginTop: 8 }}>
                Code : {isRouteErrorResponse(error) ? error.status : "500"}
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 24,
            }}
          >
            <button className="form_button_submit" onClick={() => navigate(-1)}>
              ← Retour
            </button>
            <button
              className="form_secondary_button form_secondary_button--darkmode"
              onClick={() => navigate("/", { replace: true })}
            >
              Accueil
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
