
//---Please retrieve this first-------------------------------------------------------

var decrypt_key = ""

//------------------------------------------------------------------------------------
// Here are some bonuses for make your life easier :P
// ┌───────────┬─────────────────────────────────┬──────────────────────────────────────────────────────┬──────────────────────────────────────────────────────┐ 
// │  USAGE    │ PATH                            │ SEARCH FOR                                           │ CHANGE TO                                            │ 
// ├───────────┼─────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤ 
// │ Max Exp   │ OMORI\www\data\Enemies.json     │ "exp":[0-9]+,                                        │ "exp":999999,                                        │ 
// │ I'm SPEED │ OMORI\www\js\rpg_objects.js     │ return this._moveSpeed + (this.isDashing() ? 1 : 0); │ return this._moveSpeed + (this.isDashing() ? 2 : 0); │ 
// │ ACHIEVE   │ *                               │ $gameSystem.unlockAchievement(                       │ ---                                                  │
// └───────────┴─────────────────────────────────┴──────────────────────────────────────────────────────┴──────────────────────────────────────────────────────┘ 

const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const lzstr = require("./lz-string.js")

const game_path = path.join(__dirname, '\\..\\www\\')
const unpack_path = path.join(__dirname, '\\unpacked\\')
const ivinfo_path = path.join(__dirname, '\\ivinfo.json')

const unpack_sysjson_path = path.join(__dirname, '\\unpacked\\data\\System.json')

const game_audio_path = path.join(__dirname, '\\..\\www\\audio\\')
const unpack_audio_path = path.join(__dirname, '\\unpacked\\audio\\')

const game_savefile_path = path.join(__dirname, '\\..\\www\\save\\')
const unpack_savefile_path = path.join(__dirname, '\\unpacked\\save\\')

//------------------------AUDIOS

const header_rpgmv = new Uint8Array([0x52, 0x50, 0x47, 0x4D, 0x56, 0x00, 0x00, 0x00, 0x00, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00])

rpgmvKey = () => {
    if(decrypt_key === '') { throw('Please extract decrypt key first!') }
    if(!fs.existsSync(ivinfo_path)) { throw('Please decrypt data and script first!') }
    if(!fs.existsSync(unpack_sysjson_path)) { throw('Can\'t find System.json!') }
    return JSON.parse(fs.readFileSync(unpack_sysjson_path)).encryptionKey.split(/(.{2})/).filter(Boolean)
}

decodeAllAudio = () => {
    var key = rpgmvKey()
    console.log('Decrypting audio files...')
    unpackrepack(game_audio_path, 'rpgmvo', unpack_audio_path, 'ogg', (filedata) => {
        var decoded = replaceHeader(filedata, header_rpgmv.length)
        for (var i = 0; i < 16; i++) decoded[i] = decoded[i] ^ parseInt(key[i], 16)
        return decoded
    })
    console.log('Done!')
}

encodeAllAudio = () => {
    var key = rpgmvKey()
    console.log('Encrypting and overwriting audio files...')
    unpackrepack(unpack_audio_path, 'ogg', game_audio_path, 'rpgmvo', (filedata) => {
        for (var i = 0; i < 16; i++) filedata[i] = filedata[i] ^ parseInt(key[i], 16)
        return replaceHeader(filedata, 0, header_rpgmv)
    })
    console.log('Done!')
}

//------------------------SAVES


decodeAllSave = () => {
    console.log('Decoding save files...')
    findExt(game_savefile_path, 'rpgsave').forEach((filepath) => {
        var decoded = lzstr.decompressFromBase64(fs.readFileSync(filepath, {encoding:'utf8'}))
        fs.mkdirSync(path.dirname(filepath.replace(game_savefile_path, unpack_savefile_path)), { recursive: true })
        fs.writeFileSync(filepath.replace(game_savefile_path, unpack_savefile_path).replace('.rpgsave','.json'), decoded)
    })
    console.log('Done!')
}

encodeAllSave = () => {
    console.log('Encoding and overwriting save files...')
    findExt(unpack_savefile_path, 'json').forEach((filepath) => {
        var encoded = lzstr.compressToBase64(fs.readFileSync(filepath).toString())
        fs.writeFileSync(filepath.replace(unpack_savefile_path, game_savefile_path).replace('.json','.rpgsave'), encoded)
    })
    console.log('Done!')
}

//------------------------IMAGES
decodeAllImage = () => {
    var key = rpgmvKey()
    console.log('Decoding images...')
    unpackrepack(game_path, 'rpgmvp', unpack_path, 'png', (filedata) => {
        var decoded = replaceHeader(filedata, header_rpgmv.length)
        for (var i = 0; i < 16; i++) decoded[i] = decoded[i] ^ parseInt(key[i], 16)
        return decoded
    })
    console.log('Done!')
}

encodeAllImage = () => {
    var key = rpgmvKey()
    console.log('Encoding and overwriting images...')
    unpackrepack(unpack_path, 'png', game_path, 'rpgmvp', (filedata) => {
        for (var i = 0; i < 16; i++) filedata[i] = filedata[i] ^ parseInt(key[i], 16)
        return replaceHeader(filedata, 0, header_rpgmv)
    })
    console.log('Done!')
}


//------------------------DATA & SCRIPTS

decryptData = (data) => {
    var iv = data.slice(0,16)
    data = data.slice(16)
    var d = crypto.createDecipheriv("aes-256-ctr", decrypt_key, iv)
    return Buffer.concat([d.update(data), d.final()])
}

encryptData = (data, ivHex) => {
    var iv = Buffer.from(ivHex, 'hex')
    var e = crypto.createCipheriv("aes-256-ctr", decrypt_key, iv)
    return Buffer.concat([iv, e.update(data), e.final()])
}

fileListWithIVInfo = (filePathList) => {
    result = []
    for(let i=0; i<filePathList.length; i++){
        var buff = fs.readFileSync(filePathList[i])
        var iv = buff.slice(0,16)
        result.push({path : filePathList[i], iv : iv.toString('hex')})
    }
    return result
}

findAllEncryptedData = () => {
    var encrypt = [
        { extension : 'OMORI' , real_extension : 'js'  , file_list : fileListWithIVInfo(findExt(game_path, 'OMORI' ))},
        { extension : 'KEL'   , real_extension : 'json', file_list : fileListWithIVInfo(findExt(game_path, 'KEL'   ))},
        { extension : 'HERO'  , real_extension : 'yaml', file_list : fileListWithIVInfo(findExt(game_path, 'HERO'  ))},
        { extension : 'AUBREY', real_extension : 'json', file_list : fileListWithIVInfo(findExt(game_path, 'AUBREY'))},
        { extension : 'PLUTO' , real_extension : 'yaml', file_list : fileListWithIVInfo(findExt(game_path, 'PLUTO' ))},
    ]
    return encrypt
}

decryptAllData = () => {
    if(decrypt_key === '') { throw('Please extract decrypt key first!') }

    console.log('Finding encrypted data/scripts...')
    var encryptedList = findAllEncryptedData()
    fs.writeFileSync(ivinfo_path, JSON.stringify(encryptedList, null, 4))

    console.log('Decrypting data/scripts...')
    encryptedList.forEach((encryptType) => {
        encryptType.file_list.forEach((fileInfo) => {
            var decryptedPath = fileInfo.path.replace(game_path, unpack_path).replace('.'+encryptType.extension, '.'+encryptType.real_extension)
            fs.mkdirSync(path.dirname(decryptedPath), { recursive: true })
            var buff = fs.readFileSync(fileInfo.path)
            var res = decryptData(buff).toString()
            fs.writeFileSync(decryptedPath, res)
        })
    })
    console.log('Done!')
}

encryptAllData = () => {
    if(decrypt_key === '') { throw('Please extract decrypt key first!') }

    if(!fs.existsSync(ivinfo_path)) { throw('Please decrypt first!') }
    var encryptedList = JSON.parse(fs.readFileSync(ivinfo_path))

    console.log('Encrypting and overwriting data/scripts...')
    encryptedList.forEach((encryptType) => {
        encryptType.file_list.forEach((fileInfo) => {
            var decryptedPath = fileInfo.path.replace(game_path, unpack_path).replace('.'+encryptType.extension, '.'+encryptType.real_extension)
            var buff = fs.readFileSync(decryptedPath)
            var res = encryptData(buff, fileInfo.iv)
            fs.writeFileSync(fileInfo.path, res)
        })
    })
    console.log('Done!')
}

//----------------------------------------UTILS

unpackrepack = (from_path, from_ext, to_path, to_ext, deencrypt_func) => {
    findExt(from_path, from_ext).forEach((filepath) => {
        var deencrypted = deencrypt_func(fs.readFileSync(filepath))
        fs.mkdirSync(path.dirname(filepath.replace(from_path, to_path)), { recursive: true })
        fs.writeFileSync(filepath.replace(from_path, to_path).replace('.' + from_ext, '.' + to_ext), deencrypted)
    })
}

findExt = (base, ext, files, result) => {
    files = files || fs.readdirSync(base)
    result = result || []
    files.forEach((file) => {
        var newbase = path.join(base, file)
        if (fs.statSync(newbase).isDirectory()) result = findExt(newbase, ext, fs.readdirSync(newbase), result)
        else if (file.substr(-1*(ext.length+1)) == '.' + ext) result.push(newbase)
    })
    return result
}

replaceHeader = (data, old_header_len, new_header = null) => {
    data = data.slice(old_header_len)
    if((!new_header) || (new_header.length == 0)) return data
    var temp = new Uint8Array(new_header.length + data.length)
    temp.set(new_header, 0)
    temp.set(data, new_header.length)
    return temp
}

//--------------------------------------------



switch (process.argv.slice(2)[0]) {
    case 'dd': decryptAllData(); break
    case 'ed': encryptAllData(); break
    case 'da': decodeAllAudio();  break
    case 'ea': encodeAllAudio();  break
    case 'di': decodeAllImage(); break
    case 'ei': encodeAllImage(); break
    case 'ds': decodeAllSave();  break
    case 'es': encodeAllSave();  break
    case 'd': decryptAllData(); decodeAllAudio(); decodeAllImage(); decodeAllSave(); break
    case 'e': encryptAllData(); encodeAllAudio(); encodeAllImage(); encodeAllSave(); break
    default: 
        console.log('Please pass an argument:')
        console.log('dd: Decrypt all data & script files.')
        console.log('ed: Encrypt and overwrite all data & script files.')
        console.log('da: Decrypt all audio files above.')
        console.log('ea: Encrypt and overwrite all audio files.')
        console.log('di: Decrypt all image files.')
        console.log('ei: Encrypt and overwrite all image files.')
        console.log('ds: Decrypt all save files.')
        console.log('es: Encrypt and overwrite all savefiles.')
        console.log('d: Decrypt all mentioned above.')
        console.log('e: Encrypt and overwrite all mentioned above.')
        console.log('Decrypted files are located in \'tools\\unpacked\\\' folder.')
        console.log('You can edit the decrypted files and then encrypt to apply your modification.')
        console.log('e.g. node tools\\' + path.basename(__filename) + ' ds')
}
