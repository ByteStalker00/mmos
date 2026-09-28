# MMOS • Assistenza Privata

Sito ufficiale di **MMOS • Assistenza Privata** — formattazione e ottimizzazione PC
in studio e a domicilio a **Porto d'Ascoli e San Benedetto del Tronto**,
ottimizzazione e debug da remoto ovunque.

🌐 Live: <https://bytestalker00.github.io/mmos/>

## Contenuti

- **Hero** — titolo, bio, zone cliccabili (Google Maps), CTA servizi, terminale stile `zsh`
- **Servizi** — studio, domicilio, remoto
- **Portfolio** — esempi di intervento
- **Guide** — backup, avvio lento, surriscaldamento, sicurezza
- **Build** — configurazioni AMD + ASUS/MSI verificate per 1080p, 2K, 4K e top di gamma
- **Listino** — tariffe servizi software + uscita e tariffe orarie
- **Usato** — hardware ricondizionato con MMOS come intermediario (in arrivo)
- **FAQ** — zone, remoto, backup, costi build
- **Assistente virtuale** — chat bottom-right che risponde dai contenuti del sito + handoff WhatsApp
- **Playlist Spotify** — drawer laterale a comparsa
- **Navbar/Footer** — 7 sezioni, social (Discord, Facebook, GitHub), doppio tema, particelle animate

## Anteprima link (Open Graph)

Quando il link viene condiviso (WhatsApp, Telegram, Discord, Facebook) mostra:

| Meta | Valore |
|---|---|
| `og:site_name` | Official website |
| `og:title` | MMOS • Assistenza Privata |
| `og:description` | Bio completa |
| `og:image` | `og-cover.jpg` 1200×630 |

Nota: le app memorizzano l'anteprima per URL — per forzarne una nuova, condividere con `?v=N` in coda.

## Struttura file

| File | Uso |
|---|---|
| `index.html` | Tutta la pagina (HTML + CSS inline) |
| `mmos.js` | Tema, particelle, drawer Spotify, chat, anti-tasto-destro (`?v=2` anti-cache) |
| `logo-cropped.png` | Logo in navbar, chat e footer |
| `og-cover.jpg` | Immagine anteprima condivisioni 1200×630 |
| `favicon.ico` / `favicon-180.png` | Icone browser e Apple |

Nessun file orfano: tutto ciò che è nel repo è referenziato dalla pagina.

## Temi e stile

Stile ispirato a opencode.ai: sfondo carta, etichette monospace `[ ... ]`, sezioni numerate,
card bordate, terminale scuro. Doppia tavolozza **scuro/chiaro** con selettore sole/luna
e sfondo particellare animato su canvas (rispetta `prefers-reduced-motion`, con override manuale).

## Sicurezza

- CSP rigida via meta (`script-src 'self'`, niente `eval`/inline handler)
- JavaScript tutto in `mmos.js`, validato con `node --check`
- Blocco tasto destro + F12/scorciatoie dev (deterrenza — non blindatura reale)
- Sito statico: nessun backend, login o dato utente

## Sviluppo

Nessuna build: modificare `index.html` / `mmos.js`, validare e pushare su `main`.

```powershell
node --check mmos.js
git add index.html mmos.js
git commit -m "Descrizione"
git push origin main
```

Il deploy GitHub Pages (branch `main`, root) si aggiorna in 1–2 minuti.
Per forzare il ricaricamento del JS nei browser, incrementare `?v=N` nel tag script.

© 2026 MMOS • Assistenza Privata
