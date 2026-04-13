import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { signup } from "../api/users";
import { useSelector } from "react-redux";
import Logo from "../assets/Logo";

const SignupPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const theme = useSelector((state) => state.theme.currentTheme);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      avatar: null,
    },
  });

  const avatarFile = watch("avatar")?.[0] || null;

  useEffect(() => {
    if (!avatarFile) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      await signup({
        username: data.username,
        email: data.email,
        password: data.password,
        avatar: data.avatar?.[0] || null,
      });

      navigate("/");
    } catch (err) {
      setServerError(err.message || "Impossible de créer le compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={` main_container main_container--${theme}`}>
      <section className=" auth_container auth_card modal_container modal_container--darkmode">
        <span className="auth_logo_head">
          <Logo color={theme === "darkmode" ? "white" : "black"} />
        </span>
        <div className="auth_card_content">
          <div className="auth_header">
            <h1>Créer un compte</h1>
            <p>Rejoins ton espace de travail et commence à collaborer.</p>
          </div>

          <form className="auth_form" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="username">Nom d’utilisateur</label>
            <input
              id="username"
              type="text"
              className="form_input_text form_input_text--darkmode"
              placeholder="Nico"
              {...register("username", {
                required: "Le nom d’utilisateur est requis.",
              })}
            />
            {errors.username && (
              <p className="errorMessage">{errors.username.message}</p>
            )}

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form_input_text form_input_text--darkmode"
              placeholder="exemple@mail.com"
              {...register("email", {
                required: "L’email est requis.",
              })}
            />
            {errors.email && (
              <p className="errorMessage">{errors.email.message}</p>
            )}

            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              className="form_input_text form_input_text--darkmode"
              placeholder="********"
              {...register("password", {
                required: "Le mot de passe est requis.",
                minLength: {
                  value: 6,
                  message:
                    "Le mot de passe doit contenir au moins 6 caractères.",
                },
              })}
            />
            {errors.password && (
              <p className="errorMessage">{errors.password.message}</p>
            )}

            <label htmlFor="avatar">Avatar</label>
            <input
              id="avatar"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              className="form_input_text form_input_text--darkmode auth_file_input"
              {...register("avatar", {
                required: "L’avatar est requis.",
              })}
            />
            {errors.avatar && (
              <p className="errorMessage">{errors.avatar.message}</p>
            )}

            {preview && (
              <div className="auth_avatar_preview">
                <img src={preview} alt="Prévisualisation avatar" />
              </div>
            )}

            {serverError && <p className="errorMessage">{serverError}</p>}

            <button
              type="submit"
              className="form_button_submit"
              disabled={loading}
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <p className="auth_switch_text">
            Déjà un compte ?{" "}
            <Link to="/login" className="auth_switch_link">
              Se connecter
            </Link>
          </p>

          <div className="auth_guest_divider">
            <span>ou</span>
          </div>
          <Link to="/" className="auth_guest_btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
              <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
            </svg>
            Use local scratch pad
          </Link>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
