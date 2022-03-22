# DLMP3 Bot (Discord.JS Local MP3)
Um bot do discord que toca musicas MP3 locais. Escrito em JavaScript e criado originalmente por Andrew Lee.

# Configuração
Crie um novo arquivo chamado `config.json`.
```
{
    "token": "token_aqui",
    "prefix": "dl:",
    "botOwner": "seu_id_aqui",
    "statusChannel": "id_do_chat",
    "voiceChannel": "id_da_call"
}
```

Adicione seus próprios arquivos com a extensão .mp3 na pasta `music`.

Inicialize o bot usando `node bot.js` no terminal.

# Comando Help
```
Comandos públicos
-----------
help - Mostra os comandos.
ping - Pong!
git - Link do repositório.
playing - Diz o que está tocando no momento.
about - Sobre o bot.

Somente o Dono
--------------
join - Entra na call.
resume - Despausa a música.
pause - Pausa a música.
skip - Pula a música.
leave - Sai do canal.
stop - Para o bot.
play-x - Toca uma música específica (onde x é o número da música).
```
# Bugs conhecidos
-- Quando há somente uma música na pasta, muitas vezes o bot não inicializa corretamente (por tentar dar play na segunda musica).
