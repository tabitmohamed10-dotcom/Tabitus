'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const FAQS = [
  {
    q: "TABIT est-il gratuit pour les acheteurs ?",
    a: "Oui, totalement gratuit pour les acheteurs. Publier une demande, recevoir des offres, utiliser le chat, comparer les prix — tout est gratuit pour vous. Vous ne payez que le prix de votre achat au commerçant choisi. TABIT prélève uniquement 5% de commission sur le commerçant lors d'une transaction confirmée. Aucun frais caché.",
  },
  {
    q: "Comment les commerçants sont-ils vérifiés ?",
    a: "Chaque commerçant passe par une vérification manuelle de notre équipe : patente commerciale valide, registre de commerce (RC), pièce d'identité nationale (CIN), et vérification d'adresse physique de l'établissement. Ce processus prend 24 à 48h. Les comptes non vérifiés ne peuvent pas soumettre d'offres. En cas de plainte, le compte est immédiatement suspendu pending investigation.",
  },
  {
    q: "Que se passe-t-il si le produit livré ne correspond pas ?",
    a: "TABIT dispose d'un système de protection acheteur robuste. Si le produit reçu ne correspond pas à l'offre acceptée (mauvais modèle, défaut caché, non-livraison, description trompeuse), contactez notre support dans les 48h suivant la livraison. Notre équipe médiation intervient, contacte le commerçant, et peut déclencher un remboursement complet sous 72h si le litige est confirmé.",
  },
  {
    q: "Puis-je annuler ma demande ?",
    a: "Oui, vous pouvez annuler votre demande à tout moment tant qu'aucune offre n'a été acceptée — c'est totalement gratuit et sans justification requise. Si vous avez déjà accepté une offre, contactez simultanément le commerçant et notre support pour trouver une solution amiable. Les annulations abusives répétées après acceptation peuvent entraîner un avertissement ou une suspension du compte.",
  },
  {
    q: "Comment fonctionne le paiement sur TABIT ?",
    a: "Le paiement s'effectue directement entre vous et le commerçant selon les modalités convenues dans l'offre (virement bancaire, cash à la livraison, chèque, paiement en plusieurs fois). TABIT propose également son système d'escrow optionnel — le paiement est libéré au commerçant uniquement après votre confirmation explicite de réception en bon état. Ce service est gratuit pour les acheteurs.",
  },
  {
    q: "TABIT est-il disponible dans ma ville ?",
    a: "TABIT couvre plus de 30 villes au Maroc : Casablanca, Rabat, Salé, Marrakech, Fès, Tanger, Agadir, Meknès, Oujda, Tétouan, El Jadida, Kénitra, Béni Mellal, Nador, Settat, Khouribga, Berrechid, Laayoune, Dakhla et bien d'autres. Si votre ville n'est pas encore couverte localement, vos demandes seront visibles par les commerçants nationaux pouvant livrer partout au Maroc.",
  },
  {
    q: "Quelle est la commission de TABIT exactement ?",
    a: "TABIT prélève une commission fixe de 5% sur le montant HT de chaque transaction confirmée, payée exclusivement par le commerçant. Cette commission couvre : la mise en relation, la sécurisation de la transaction, le service de médiation, le support client et la maintenance de la plateforme. Aucun frais fixe, aucun abonnement, aucun frais d'inscription pour les commerçants. Vous ne payez qu'en cas de succès.",
  },
  {
    q: "Comment créer un compte commerçant ?",
    a: "Inscrivez-vous sur TABIT en sélectionnant 'Je suis commerçant'. Renseignez vos informations professionnelles : raison sociale, numéro de patente, registre de commerce, description de votre activité, catégories de produits, coordonnées complètes et adresse de l'établissement. Notre équipe vérifie votre dossier sous 24-48h et vous envoie une confirmation par email et SMS. Vous pouvez ensuite recevoir et répondre aux demandes dans vos catégories.",
  },
  {
    q: "Mes données personnelles sont-elles protégées ?",
    a: "Absolument. TABIT est entièrement conforme à la loi 09-08 sur la protection des données personnelles au Maroc (équivalent du RGPD européen). Vos coordonnées (numéro de téléphone, email, adresse précise) sont masquées pendant toutes les phases d'échange. Elles ne sont partagées avec le commerçant qu'après acceptation mutuelle et uniquement pour finaliser la transaction. Vos données ne sont jamais vendues à des tiers.",
  },
  {
    q: "TABIT est-il disponible en application mobile ?",
    a: "TABIT est une Progressive Web App (PWA) installable sur iOS (Safari) et Android (Chrome) directement depuis le navigateur — aucun téléchargement App Store ou Google Play requis. Sur iPhone : Safari → Partager → 'Sur l'écran d'accueil'. Sur Android : Chrome → Menu → 'Ajouter à l'écran d'accueil'. Vous bénéficiez d'une expérience native avec notifications push, accès hors ligne aux données et interface optimisée mobile.",
  },
  {
    q: "Comment fonctionne le module B2B pour les entreprises ?",
    a: "TABIT B2B est conçu pour les entreprises, PME, startups et administrations publiques marocaines. Il offre : gestion multi-utilisateurs avec droits d'accès, appels d'offres formalisés avec cahier des charges téléchargeable, tableau de bord achats centralisé, historique et reporting exportable pour la comptabilité, facturation professionnelle, NDA et garanties de confidentialité renforcées, SLA garanti et account manager dédié. Contactez-nous pour un accès entreprise prioritaire.",
  },
  {
    q: "Comment fonctionne le système de notation entre acheteurs et commerçants ?",
    a: "Après chaque transaction confirmée par les deux parties, acheteur ET commerçant se notent mutuellement sur 5 étoiles et laissent un commentaire textuel. Les notes sont vérifiées automatiquement et manuellement — elles ne peuvent pas être supprimées ou modifiées après 24h. Les commerçants avec une note inférieure à 3.5/5 sur 10+ transactions sont mis sous surveillance et peuvent être suspendus après audit. Les acheteurs avec un historique de mauvaise foi sont également signalés.",
  },
]

export default function FAQ() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      style={{
        background: '#FAFAF7',
        padding: 'clamp(56px,8vw,96px) clamp(20px,5vw,56px)',
      }}
    >
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: '#0C0B09', marginBottom: 12, fontWeight: 400,
          }}>
            Questions fréquentes
          </h2>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 20, color: '#C9922A', direction: 'rtl', display: 'block', marginBottom: 16,
          }}>
            الأسئلة الشائعة
          </p>
          <p style={{ fontSize: 15, color: '#8A856E' }}>
            Tout ce que vous devez savoir avant de commencer
          </p>
        </motion.div>

        <div style={{ borderTop: '1px solid #E8E0CC' }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: '1px solid #E8E0CC' }}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: 'clamp(16px, 3vw, 20px) 0',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16,
                  minHeight: 60,
                }}
              >
                <span style={{ fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 500, color: '#0C0B09', lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <span
                  style={{
                    flexShrink: 0, fontSize: 22, fontWeight: 300,
                    color: '#C9922A', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  +
                </span>
              </button>

              <div style={{ display: open === i ? 'block' : 'none' }}>
                <p style={{
                  paddingBottom: 'clamp(16px, 3vw, 20px)',
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  lineHeight: 1.75, color: '#8A856E',
                }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            marginTop: 40, padding: 'clamp(20px,4vw,28px)',
            borderRadius: 16, textAlign: 'center',
            background: 'linear-gradient(135deg, #0C0B09, #171612)',
            border: '1px solid rgba(201,146,42,0.2)',
          }}
        >
          <p style={{ color: '#C4BCA8', fontSize: 15, marginBottom: 16 }}>
            Vous n'avez pas trouvé votre réponse ?
          </p>
          <motion.a
            href="mailto:support@tabit.ma"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              background: 'rgba(201,146,42,0.15)', border: '1px solid rgba(201,146,42,0.3)',
              color: '#C9922A', textDecoration: 'none', fontWeight: 600, fontSize: 14,
            }}
            whileHover={{ background: 'rgba(201,146,42,0.25)', scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            📧 Contactez notre équipe
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
