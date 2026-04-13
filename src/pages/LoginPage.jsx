import { Link, useNavigate, useRevalidator } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo";

const LoginPage = () => {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useSelector((state) => state.theme.currentTheme);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      // login() appelle loginRequest + refreshAuth — user est settée avant qu'on continue
      await login({ email: data.email, password: data.password });
      // revalidate force le loader kanbanLoader à se ré-exécuter avec la session active
      // navigate attend que la revalidation soit terminée grâce au await implicite de React Router
      revalidate();
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(err.message || "Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`main_container main_container--${theme}`}>
      <section className="auth_container auth_card modal_container modal_container--darkmode">
        <span className="auth_logo_head">
          <Logo color={theme === "darkmode" ? "white" : "black"} />
        </span>
        <div className="auth_card_content">
          <div className="auth_header">
            <h1>Connexion</h1>
            <p>Connecte-toi pour accéder à ton espace Kanban collaboratif.</p>
          </div>

          <form className="auth_form" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form_input_text form_input_text--darkmode"
              placeholder="exemple@mail.com"
              {...register("email", { required: "L'email est requis." })}
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
              })}
            />
            {errors.password && (
              <p className="errorMessage">{errors.password.message}</p>
            )}

            {serverError && <p className="errorMessage">{serverError}</p>}

            <button
              type="submit"
              className="form_button_submit"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="auth_switch_text">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="auth_switch_link">
              Créer un compte
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

export default LoginPage;
