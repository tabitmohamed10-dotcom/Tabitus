export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
        <input type="text" placeholder="Nom complet" className="w-full border rounded-xl p-3 mb-4" />
        <input type="email" placeholder="Email" className="w-full border rounded-xl p-3 mb-4" />
        <input type="password" placeholder="Mot de passe" className="w-full border rounded-xl p-3 mb-4" />
        <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl">Créer mon compte</button>
        <p className="text-center mt-4 text-sm">Déjà inscrit ? <a href="/auth/login" className="text-orange-500">Se connecter</a></p>
      </div>
    </div>
  )
}
