# Configurazione letta in automatico da Gunicorn (anche se il comando di avvio di Render è solo "gunicorn app:app").
# Le chiamate a Gemini per una lezione intera possono durare diversi minuti (i modelli Flash 3.x
# ragionano a lungo): senza un limite alto il server interrompe la richiesta. Render accetta richieste
# fino a circa 100 minuti; il proxy verso Gemini si ferma a 540 s, sotto questo valore.
timeout = 600
graceful_timeout = 30
# Più richieste in parallelo (es. elenco modelli mentre è in corso una generazione)
threads = 4
