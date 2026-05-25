export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        <input type="email" placeholder="Email" className="w-full border rounded-xl p-3 mb-4" />
        <input type="password" placeholder="Mot de passe" className="w-full border rounded-xl p-3 mb-4" />
        <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl">Se connecter</button>
        <p className="text-center mt-4 text-sm">Pas de compte ? <a href="/auth/register" className="text-orange-500">S'inscrire</a></p>
      </div>
    </div>
  )
}
