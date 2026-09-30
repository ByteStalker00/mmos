# MMOS • Assistenza Privata

Sito ufficiale di **MMOS • Assistenza Privata** — formattazione e ottimizzazione PC
in studio e a domicilio a **Porto d'Ascoli e San Benedetto del Tronto**,
ottimizzazione e debug da remoto ovunque.

🌐 Live: <https://bytestalker00.github.io/mmos/>

## Biografia

> Offro servizi di formattazione e ottimizzazione PC in studio e a domicilio,
> esclusivamente nella zona di Porto d'Ascoli e San Benedetto del Tronto.
> Da remoto eseguo unicamente interventi di ottimizzazione e debug.

## Servizi

- **In studio** — formattazione completa: backup dati, reinstallazione pulita, driver e programmi
- **A domicilio** — solo Porto d'Ascoli e San Benedetto del Tronto
- **Da remoto** — unicamente ottimizzazione e debug software (€ 21/h)
- **Build su misura** — da privato non vendo componenti: consiglio cosa acquistare,
  tu compri, io assemblo con OS, driver, ottimizzazione e test finali
- **Usato garantito** (in arrivo) — contatti MMOS, noi gestiamo tutto col venditore
  e verifichiamo che funzioni

## Tariffe

| Servizio | Prezzo |
|---|---|
| Installazione SO (pulita + driver + base) | € 48 |
| Ripristino SO, primo avvio, programmi, pulizia PC | € 34 |
| Rimozione virus (analisi + protezione) | € 41 |
| Backup / trasferimento | da € 34 |
| Assistenza online | € 21/h |
| Uscita in zona | € 21 |
| Privati / Aziende | € 21/h / € 28/h |

## Contatti

- Facebook: <https://www.facebook.com/profile.php?id=61594506196534>
- Discord: <https://discord.gg/v6fb4zrPfK>
- WhatsApp: <https://wa.me/393755236202>
- GitHub: <https://github.com/ByteStalker00>

## Contenuti del sito

Hero con zone cliccabili (Maps) e terminale · Servizi · Portfolio · Guide e consigli ·
Build AMD + ASUS/MSI verificate (1080p, 2K, 4K, top RTX 5090) · Listino · Usato ·
FAQ · Assistente virtuale con handoff WhatsApp e fallback IA gratis · Playlist Spotify · Doppio tema
chiaro/scuro · Particelle animate · CSP rigida.

## Anteprima link (Open Graph)

| Meta | Valore |
|---|---|
| `og:site_name` | Official website |
| `og:title` | MMOS • Assistenza Privata |
| `og:description` | Bio completa |
| `og:image` | `og-cover.jpg` 1200×630 |

Le app memorizzano l'anteprima per URL — per forzarne una nuova, condividere con `?v=N` in coda.

## Struttura file

| File | Uso |
|---|---|
| `index.html` | Home: hero, servizi, portfolio, FAQ, Discord (HTML + CSS inline) |
| `guide.html` / `build.html` / `listino.html` / `usato.html` | Pagine dedicate (stesso head/CSS/nav/footer) |
| `mmos.js` | Tema, particelle, drawer Spotify, chat + IA, anti-tasto-destro (`?v=8` anti-cache) |
| `logo-cropped.png` | Logo in navbar, chat e footer |
| `brands/` | Loghi marchi consigliati (pagina Build) |
| `og-cover.jpg` | Immagine anteprima condivisioni 1200×630 |
| `favicon.ico` / `favicon-180.png` | Icone browser e Apple |

## Sviluppo

Nessuna build: modificare, validare e pushare su `main`.

```powershell
node --check mmos.js
git add index.html mmos.js guide.html build.html listino.html usato.html
git commit -m "Descrizione"
git push origin main
```

Deploy GitHub Pages (branch `main`, root) in 1–2 minuti.
Per forzare il ricaricamento del JS, incrementare `?v=N` nel tag script.

© 2026 MMOS • Assistenza Privata
