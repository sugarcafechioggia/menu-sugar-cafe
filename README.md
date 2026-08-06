# Menù digitale Sugar Cafè

Il sito e il PDF stampabile condividono lo stesso `menu.json`.

## PDF A4 aggiornato automaticamente

Quando `menu.json` viene modificato sul branch `main`, GitHub Actions esegue `print/generate_pdf.py`, verifica il risultato e aggiorna automaticamente `menu-sugar-cafe-a4-2-colonne.pdf`.

L'automazione può essere avviata anche manualmente dalla scheda **Actions**, scegliendo **Rigenera PDF del menu** e poi **Run workflow**.
