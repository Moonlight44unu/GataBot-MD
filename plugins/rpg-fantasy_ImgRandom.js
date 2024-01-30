import fetch from 'node-fetch'
import fs from 'fs'
const fantasyDBPath = './fantasy.json'
let id_message, pp, dato, fake, user, estado, idUsuarioExistente, nombreImagen, fantasyDB, jsonURL, response, data, userId, voto = null

let handler = async (m, { command, usedPrefix, conn }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
try {
response = await fetch(jsonURL)
data = await response.json()

if (data.infoImg && data.infoImg.length > 0) {
dato = data.infoImg[Math.floor(Math.random() * data.infoImg.length)]
pp = await conn.profilePictureUrl(who, 'image').catch((_) => dato.url)

fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}
estado = 'Libre'
const codigoActual = dato.code
const usuarioExistente = fantasyDB.find(user => {
const id = Object.keys(user)[0]
const fantasy = user[id].fantasy
return fantasy.some(personaje => personaje.id === codigoActual)
})

if (usuarioExistente) {
idUsuarioExistente = Object.keys(usuarioExistente)[0];
nombreImagen = data.infoImg.find(personaje => personaje.code === codigoActual)?.name

if (nombreImagen) {
estado = `*${nombreImagen}* fue comprado por *${conn.getName(idUsuarioExistente)}*`
}}

let info = `*⛱️ FANTASÍA RPG ⛱️*\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*\n✓ *Nombre:* ${dato.name}\n✓ *Origen:* ${dato.desp}\n✓ *Costo:* \`\`\`${dato.price}\`\`\` *${rpgshop.emoticon('money')}*\n✓ *Clase:* ${dato.class}\n✓ *Tipo:* ${dato.type}\n✓ *ID:* \`\`\`${codigoActual}\`\`\`\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*\n✓ *Estado:* ${estado}`
info += `\n\n${estado === 'Libre' ? '_Responde a este mensaje con "c", "🛒", o "🐱" para comprarlo_' : ''}`
id_message = (await conn.sendFile(m.chat, dato.url, 'error.jpg', info.trim(), fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: false,
title: `${conn.getName(m.sender)}`,
body: `${dato.desp}`,
mediaType: 1,
sourceUrl: accountsgb.getRandom(),
thumbnailUrl: pp
}}
}, { caption: 'imagen_info' })).key.id
} else {
console.error('No se han encontrado imágenes.')
conn.sendMessage(m.chat, 'Error al obtener o procesar los datos.', { quoted: m })
}} catch (error) {
console.error('Error al obtener o procesar los datos: ', error)
conn.sendMessage(m.chat, 'Error al procesar la solicitud.', { quoted: m })
}

handler.before = async (m) => {
user = global.db.data.users[m.sender]

/*if (m.quoted && m.quoted.id === id_message && ['👍', '❤️', '👎'].includes(m.text)) {
  const emoji = m.text;
  userId = m.sender;
  const usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId);

  if (usuarioExistente) {
    const idUsuarioExistente = Object.keys(usuarioExistente)[0];
    const nombrePersonaje = dato.name;

    if (nombrePersonaje) {
      const flow = usuarioExistente[idUsuarioExistente].flow || [];
      const votoExistente = flow.find((voto) => voto && voto.character_name === nombrePersonaje && voto[emoji.toLowerCase()]);

      if (votoExistente && votoExistente[emoji.toLowerCase()]) {
        const errorMessage = `No puedes dar *${emoji}* a *${nombrePersonaje}* porque ya lo hiciste antes.`;
        conn.reply(m.chat, errorMessage, m);
      } else {
        const emojiAntes = flow.find((voto) => voto && voto.character_name === nombrePersonaje && (voto.like || voto.dislike || voto.superlike));
        const updatedFlow = [
          ...(flow || []).filter((voto) => voto.character_name !== nombrePersonaje),
          {
            character_name: nombrePersonaje,
            like: emoji === '👍',
            dislike: emoji === '👎',
            superlike: emoji === '❤️',
          },
        ];
        usuarioExistente[idUsuarioExistente].flow = updatedFlow;

        if (!usuarioExistente[idUsuarioExistente].fantasy) {
          usuarioExistente[idUsuarioExistente].fantasy = [
            {
              id: false,
              status: false,
            },
          ];
        }

        fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8');

        if (emojiAntes) {
          const cambioEmojiMessage = `Has decidido cambiar tu reacción anterior *${emojiAntes.like ? '👍' : (emojiAntes.dislike ? '👎' : '❤️')}* por *${emoji}* en *${nombrePersonaje}*.`;
          conn.reply(m.chat, cambioEmojiMessage, m);
        } else {
          const confirmationMessage = `¡Has respondido *${emoji}* para *${nombrePersonaje}*! 🌟`;
          conn.reply(m.chat, confirmationMessage, m);
        }
      }
    }
  }
}*/

if (m.quoted && m.quoted.id === id_message && ['👍', '❤️', '👎'].includes(m.text)) {
  const emoji = m.text;
  userId = m.sender;
  const usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId);

  if (usuarioExistente) {
    const idUsuarioExistente = Object.keys(usuarioExistente)[0];
    const nombrePersonaje = dato.name;

    if (nombrePersonaje) {
      const flow = usuarioExistente[idUsuarioExistente].flow || [];
      const votoExistente = flow.find((voto) => voto && voto.character_name === nombrePersonaje && voto[emoji.toLowerCase()]);
      
      const emojiAntes = flow.find((voto) => voto && voto.character_name === nombrePersonaje && (voto.like || voto.dislike || voto.superlike));
      const done = !!emojiAntes; // Variable para determinar si es la primera vez que el usuario da una reacción

      if (votoExistente && votoExistente[emoji.toLowerCase()]) {
        const errorMessage = `No puedes dar *${emoji}* a *${nombrePersonaje}* porque ya lo hiciste antes.`;
        conn.reply(m.chat, errorMessage, m);
      } else {
        const updatedFlow = [
          ...(flow || []).filter((voto) => voto.character_name !== nombrePersonaje),
          {
            character_name: nombrePersonaje,
            like: emoji === '👍',
            dislike: emoji === '👎',
            superlike: emoji === '❤️',
          },
        ];
        usuarioExistente[idUsuarioExistente].flow = updatedFlow;

        if (!usuarioExistente[idUsuarioExistente].fantasy) {
          usuarioExistente[idUsuarioExistente].fantasy = [
            {
              id: false,
              status: false,
            },
          ];
        }

        fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8');

        if (done) {
          if (emojiAntes.like !== votoExistente.like || emojiAntes.dislike !== votoExistente.dislike || emojiAntes.superlike !== votoExistente.superlike) {
            const cambioEmojiMessage = `Has decidido cambiar tu reacción anterior *${emojiAntes.like ? '👍' : (emojiAntes.dislike ? '👎' : '❤️')}* por *${emoji}* en *${nombrePersonaje}*.`;
            conn.reply(m.chat, cambioEmojiMessage, m);
          } else {
            const errorMessage = `No puedes dar *${emoji}* a *${nombrePersonaje}* porque ya lo hiciste antes.`;
            conn.reply(m.chat, errorMessage, m);
          }
        } else {
          const confirmationMessage = `¡Has respondido *${emoji}* para *${nombrePersonaje}*! 🌟`;
          conn.reply(m.chat, confirmationMessage, m);
        }
      }
    }
  }
}




        
if (m.quoted && m.quoted.id === id_message && ['c', '🛒', '🐱'].includes(m.text.toLowerCase())) {
const cantidadFaltante = dato.price - user.money

if (user.money < dato.price) {

fake = { contextInfo: { externalAdReply: { title: `¡Ese Personaje ya fue comprado!`, body: `😅 Compra otro personaje`, sourceUrl: accountsgb.getRandom(), thumbnailUrl: gataMenu.getRandom() } } }        
let No_compra = `*${nombreImagen}* fue comprado por *${conn.getName(idUsuarioExistente)}*`
if (estado !== 'Libre') return conn.reply(m.chat, No_compra, m, fake)       
fake = { contextInfo: { externalAdReply: { title: `¡Insuficientes ${rpgshop.emoticon('money')}!`, body: `😼 Completa misiones del RPG`, sourceUrl: accountsgb.getRandom(), thumbnailUrl: gataMenu.getRandom() } } }
conn.reply(m.chat, `Te falta *${cantidadFaltante} ${rpgshop.emoticon('money')}* para comprar a *${dato.name}*\n\n*Actualmente tienes ${user.money} ${rpgshop.emoticon('money')}*`, m, fake)
} else {
        
jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
response = await fetch(jsonURL)
data = await response.json()
fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}

const usuarioConCodigo = fantasyDB.find(user => {
const id = Object.keys(user)[0]
const fantasy = user[id].fantasy
return fantasy.some(personaje => personaje.id === dato.code)
})

if (usuarioConCodigo) {
const idUsuarioConCodigo = Object.keys(usuarioConCodigo)[0]
const nombreUsuario = conn.getName(idUsuarioConCodigo)
const nombrePersonaje = data.infoImg.find(personaje => personaje.code === dato.code)?.name

if (nombrePersonaje) {
if (m.sender == idUsuarioConCodigo) {
fake = { contextInfo: { externalAdReply: { title: `😊 Ya fue comprado antes`, body: `🌟 ¡Compra más para llegar al top!`, sourceUrl: accountsgb.getRandom(), thumbnailUrl: gataMenu.getRandom() } } }
const mensaje_ = `El personaje *${nombrePersonaje}* ya es tuyo!!`
conn.reply(m.chat, mensaje_, m, fake)
} else {
fake = { contextInfo: { externalAdReply: { title: `❌ No puedes comprar esto: ${nombrePersonaje}`, body: `🙂 ¡Compra otro personaje!`, sourceUrl: accountsgb.getRandom(), thumbnailUrl: gataMenu.getRandom() } } }
const mensaje = `Este personaje *${nombrePersonaje}* está reclamado por *${nombreUsuario}*`
conn.reply(m.chat, mensaje, m, fake)
        
}}} else {        
function realizarCompra() {
userId = m.sender
const usuarioExistente = fantasyDB.find(user => Object.keys(user)[0] === userId)
if (usuarioExistente) {
usuarioExistente[userId].fantasy.push({
id: dato.code,
status: true
})
} else {
const nuevoUsuario = {
[userId]: {
fantasy: [
{
id: dato.code,
status: true
}]}}
fantasyDB.push(nuevoUsuario);
}
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8');
}
realizarCompra()
   
user.money -= dato.price
fake = { contextInfo: { externalAdReply: { title: `¡Disfruta de tú personaje!`, body: `${dato.desp}`, sourceUrl: accountsgb.getRandom(), thumbnailUrl: dato.url } } }
conn.reply(m.chat, `El usuario *${conn.getName(m.sender)}* ha comprado a *${dato.name}*`, m, fake)
}}}



}
}
handler.command = /^(fantasy|fy)$/i
export default handler


