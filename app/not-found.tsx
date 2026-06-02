import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-9xl font-bold text-orange-500 mb-4">404</div>
        <h1 className="text-3xl font-bold mb-2">Page non trouvée</h1>
        <p className="text-gray-500 mb-8">Désolé, la page que vous recherchez n'existe pas.</p>
        <Link href="/" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
