import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { login } from "../api/users";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useSelector((state) => state.theme.currentTheme);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      await login(data);
      navigate("/");
    } catch (err) {
      setServerError(err.message || "Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`main_container main_container--${theme}`}>
      <section className="auth_card modal_container modal_container--darkmode">
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
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
