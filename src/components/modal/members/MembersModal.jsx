import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  getBoardById,
  addMember,
  updateMember,
  deleteMember,
} from "../../../api/boards";
import CloseIcon from "../../../assets/icons/CloseIcon";
import UserSearcher from "../../UserSearcher";

const ROLES = ["admin", "member", "viewer"];

// Badge rôle — affiché pour soi-même et pour les non-admins
const RoleBadge = ({ role }) => {
  const colors = {
    admin: "#635FC7",
    member: "#67E2AE",
    viewer: "#828FA3",
  };
  return (
    <span
      className="member_role_badge"
      style={{ color: colors[role] ?? "#828FA3" }}
    >
      {role}
    </span>
  );
};

// Avatar avec fallback initiales
const MemberAvatar = ({ user }) => {
  const [imgError, setImgError] = useState(false);

  if (user?.avatar && !imgError) {
    return (
      <img
        src={user.avatar}
        alt={user.username}
        className="member_avatar"
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback : cercle avec initiale
  return (
    <div className="member_avatar member_avatar--initials">
      {user?.username?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
};

const MembersModal = ({
  setMembersModalIsOpen,
  boardId,
  currentUserId,
  isAdmin, // rôle de l'utilisateur courant sur ce board
}) => {
  const theme = useSelector((state) => state.theme.currentTheme);

  const [members, setMembers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("member");
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const memberUserIds = members.map((m) => m.userId);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const board = await getBoardById(boardId);
      setMembers(board.memberships ?? []);
    } catch {
      setServerError("Impossible de charger les membres");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [boardId]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSelectUser = async (user) => {
    setServerError("");
    try {
      await addMember(boardId, { email: user.email, role: selectedRole });
      showSuccess(`${user.username} ajouté en tant que ${selectedRole}.`);
      fetchMembers();
    } catch (err) {
      setServerError(err.message || "Erreur lors de l'invitation");
    }
  };

  const handleRoleChange = async (membershipId, newRole) => {
    setServerError("");
    try {
      await updateMember(boardId, membershipId, { role: newRole });
      showSuccess("Rôle mis à jour.");
      fetchMembers();
    } catch (err) {
      setServerError(err.message || "Erreur lors de la mise à jour");
    }
  };

  const handleRemove = async (membershipId, username) => {
    setServerError("");
    try {
      await deleteMember(boardId, membershipId);
      showSuccess(`${username} retiré du board.`);
      fetchMembers();
    } catch (err) {
      setServerError(err.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="modal_background">
      <div
        className={`modal_container modal_container--${theme} modal_container--large`}
      >
        <div className="modal_content">
          {/* Header */}
          <div className={`form_title form_title--${theme}`}>
            <h2>Membres du board</h2>
            <button type="button" onClick={() => setMembersModalIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          {/* Liste des membres */}
          {isLoading ? (
            <p className="search_count">Chargement...</p>
          ) : (
            <ul className="members_list">
              {members.map((membership) => {
                const isSelf =
                  Number(membership.userId) === Number(currentUserId);

                return (
                  <li
                    key={membership.id}
                    className={`member_item member_item--${theme}`}
                  >
                    {/* Avatar + infos */}
                    <div className="member_info">
                      <MemberAvatar user={membership.user} />
                      <div className="member_text">
                        <p className="member_username">
                          {membership.user?.username}
                          {isSelf && (
                            <span className="member_self_tag"> (vous)</span>
                          )}
                        </p>
                        <p className="member_email">{membership.user?.email}</p>
                      </div>
                    </div>

                    {/* Actions — admin uniquement, et pas sur soi-même */}
                    <div className="member_actions">
                      {!isAdmin || isSelf ? (
                        // Vue lecture seule — badge rôle uniquement
                        <RoleBadge role={membership.role} />
                      ) : (
                        // Vue admin — select rôle + bouton supprimer
                        <>
                          <select
                            className={`form_input_text form_input_text--${theme} member_role_select`}
                            defaultValue={membership.role}
                            onChange={(e) =>
                              handleRoleChange(membership.id, e.target.value)
                            }
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            className="member_remove_btn"
                            onClick={() =>
                              handleRemove(
                                membership.id,
                                membership.user?.username,
                              )
                            }
                            title="Retirer du board"
                          >
                            <CloseIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Section invitation — admin uniquement */}
          {isAdmin && (
            <>
              <hr className={`members_divider members_divider--${theme}`} />

              <div className="members_invite_section">
                <h3>Inviter un membre</h3>

                <div className="members_role_picker">
                  <label>Rôle :</label>
                  <select
                    className={`form_input_text form_input_text--${theme}`}
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <UserSearcher
                  excludeIds={memberUserIds}
                  onSelect={handleSelectUser}
                  theme={theme}
                />
              </div>
            </>
          )}

          {serverError && <p className="errorMessage">{serverError}</p>}
          {successMessage && <p className="successMessage">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default MembersModal;
