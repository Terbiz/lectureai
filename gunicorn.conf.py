# Configurazione letta in automatico da Gunicorn (anche se il comando di avvio di Render è solo "gunicorn app:app").
# Le chiamate a Gemini per una lezione intera possono durare più di 30 secondi (il valore predefinito):
# senza questo limite più alto il server interrompe la richiesta e il sito riceve un errore 502.
timeout = 180
graceful_timeout = 30
# Più richieste in parallelo (es. elenco modelli mentre è in corso una generazione)
threads = 4
