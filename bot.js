
/**************************************************************************
 * 
 *  DLMP3 Bot: A Discord bot that plays local mp3 audio tracks.
 *  (C) Copyright 2020
 *  Programmed by Andrew Lee 
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 ***************************************************************************/

const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const config = require('./config.json');
let dispatcher;
let audio;
let voiceChannel;
let fileData;
var files = fs.readdirSync('./music');

bot.login(config.token); 

function playAudio(music) {
  voiceChannel = bot.channels.cache.get(config.voiceChannel);
  if (!voiceChannel) return console.error('The voice channel does not exist!\n(Have you looked at your configuration?)');
  
  voiceChannel.join().then(connection => {

    while (true) {
	  audio = files[parseInt(music[1])]
	  console.log('Procurando arquivos...');
	  if (audio.endsWith('.mp3')) {
        break;
      }
    }

    dispatcher = connection.play('./music/' + audio);
    
    dispatcher.on('start', () => {
      console.log('Tocando: ' + audio);
      fileData = "Now Playing: " + audio;
      fs.writeFile("now-playing.txt", fileData, (err) => { 
      if (err) 
      console.log(err); 
      }); 
      const statusEmbed = new Discord.MessageEmbed()
      .addField('Tocando: ', `${audio}`)
      .setColor('#0066ff')

      let statusChannel = bot.channels.cache.get(config.statusChannel);
      if (!statusChannel) return console.error('Esse canal de texto não existe! Pulando.');
      statusChannel.send(statusEmbed);
    });
    
    dispatcher.on('error', console.error);

    dispatcher.on('finish', () => {
      console.log('A musica acabou.');
	  playAudio(music)
    });
    
  }).catch(e => {
    console.error(e);
  });
  
}

bot.on('ready', () => {
  console.log('\x1b[34m%s\x1b[0m', 'Bot pronto!');
  console.log(`Logado como ${bot.user.tag}!`);
  console.log(`Prefixo: ${config.prefix}`);
  console.log(`ID dono: ${config.botOwner}`);
  console.log(`Canal de voz: ${config.voiceChannel}`);
  console.log(`Canal de texto: ${config.statusChannel}\n`);
  for (i = 0; i < files.length; i++){
	  console.log('\x1b[36m%s\x1b[0m', `${files[i]} - ${i}`)
  }
  console.log(' ')

  bot.user.setPresence({
    activity: {
      name: `Musicas | ${config.prefix}help`
    },
    status: 'online',
  }).then(presence => console.log(`Atividade settada como "${presence.activities[0].name}"`)).catch(console.error);

  const readyEmbed = new Discord.MessageEmbed()
  .setAuthor(`${bot.user.username}`, bot.user.avatarURL())
  .setDescription('Bot iniciado.')
  .setColor('#0066ff')

  let statusChannel = bot.channels.cache.get(config.statusChannel);
  if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
  statusChannel.send(readyEmbed);
  console.log('\x1b[32m%s\x1b[0m', 'Conectado.');
});

bot.on('message', async msg => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  if (!msg.content.startsWith(config.prefix)) return;
  let command = msg.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  // Public allowed commands

  if (command == 'help') {
    if (!msg.guild.member(bot.user).hasPermission('EMBED_LINKS')) return msg.reply('**ERROR: This bot doesn\'t have the permission to send embed links please enable them to use the full help.**');
    const helpEmbed = new Discord.MessageEmbed()
    .setAuthor(`${bot.user.username} Help`, bot.user.avatarURL())
    .setDescription(`Currently playing \`${audio}\`.`)
    .addField('Public Commands', `${config.prefix}help\n${config.prefix}ping\n${config.prefix}git\n${config.prefix}playing\n${config.prefix}about\n`, true)
    .addField('Bot Owner Only', `${config.prefix}join\n${config.prefix}resume\n${config.prefix}pause\n${config.prefix}skip\n${config.prefix}leave\n${config.prefix}stop\n`, true)
    .setFooter('© FODASE Inc.')
    .setColor('#0066ff')

    msg.channel.send(helpEmbed);
  }

  if (command == 'ping') {
    msg.reply('Pong!');
  }

  if (command == 'git') {
    msg.reply('This is the source code of this project.\nhttps://github.com/snowzzrra/DLMP3');
  }

  if (command == 'playing') {
    msg.channel.send('Tocando `' + audio + '`.');
  }

  if (command == 'about') {
    msg.channel.send('The bot code was created by Andrew Lee (Alee#4277) and forked by Guilherme Snow (snow#1991). Written in Discord.JS and licensed with GPL-3.0.');
  }

  if (![config.botOwner].includes(msg.author.id)) return;

  // Bot owner exclusive

  if (command == 'join') {
    msg.reply('Joining voice channel.');
    console.log('\x1b[32m%s\x1b[0m', 'Conectado.');
    playAudio();
  }

  if (command == 'resume') {
    msg.reply('Tocando de novo.');
    dispatcher.resume();
  }

  if (command == 'pause') {
    msg.reply('Pausando...');
    dispatcher.pause();
  }

  if (command == 'skip') {
    msg.reply('Pulando `' + audio + '`...');
    dispatcher.pause();
    dispatcher = null;
	music[1] = parseInt(music[1])+1;
    playAudio(music);
  }

  if (command == 'leave') {
    voiceChannel = bot.channels.cache.get(config.voiceChannel);
    if (!voiceChannel) return console.error('Esse canal de voz não existe!\n(Você já viu as configurações?)');
    msg.reply('Vazando.');
    console.log('Leaving voice channel.');
    fileData = "Agora tocando: Nada";
    fs.writeFile("now-playing.txt", fileData, (err) => { 
    if (err) 
    console.log(err); 
    }); 
    audio = "Não tocando";
    dispatcher.destroy();
    voiceChannel.leave();
  }

  if (command == 'stop') {
    await msg.reply('Desligando...');
    fileData = "Agora tocando: Nada";
    await fs.writeFile("now-playing.txt", fileData, (err) => { 
    if (err) 
    console.log(err); 
    }); 
    const statusEmbed = new Discord.MessageEmbed()
    .setAuthor(`${bot.user.username}`, bot.user.avatarURL())
    .setDescription(`É isso! Desligando o ${bot.user.username}...`)
    .setColor('#0066ff')
    let statusChannel = bot.channels.cache.get(config.statusChannel);
    if (!statusChannel) return console.error('O canal de status não existe! Pulando.');
    await statusChannel.send(statusEmbed);
    console.log('\x1b[31m%s\x1b[0m', 'Desligando...');
    dispatcher.destroy();
    bot.destroy();
    process.exit(0);
  }
  
  if (command.startsWith('play')) {
	  music = command.split('-');
	  playAudio(music);
  }

});