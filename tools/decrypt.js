
//---Please retrieve this first-------------------------------------------------------

var decrypt_key = ""

//------------------------------------------------------------------------------------
// Here are some bonuses for make your life easier :P
// ┌───────────┬─────────────────────────────────┬──────────────────────────────────────────────────────┬──────────────────────────────────────────────────────┐ 
// │  USAGE    │ PATH                            │ SEARCH FOR                                           │ CHANGE TO                                            │ 
// ├───────────┼─────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤ 
// │ Max Exp   │ OMORI\www\data\Enemies.KEL.json │ "exp":[0-9]+,                                        │ "exp":999999,                                        │ 
// │ I'm SPEED │ OMORI\www\js\rpg_objects.js     │ return this._moveSpeed + (this.isDashing() ? 1 : 0); │ return this._moveSpeed + (this.isDashing() ? 2 : 0); │ 
// │ ACHIEVE   │ *                               │ $gameSystem.unlockAchievement(                       │ ---                                                  │
// └───────────┴─────────────────────────────────┴──────────────────────────────────────────────────────┴──────────────────────────────────────────────────────┘ 

const crypto = require("crypto")
const path = require("path")
const fs = require("fs")

const game_path = path.join(__dirname, '\\..\\www\\')
const unpack_path = path.join(__dirname, '\\unpacked\\')
const ivinfo_path = path.join(__dirname, '\\ivinfo.json')

//------------------------IMAGES

const header_rpgmvp = new Uint8Array([0x52, 0x50, 0x47, 0x4D, 0x56, 0x00, 0x00, 0x00, 0x00, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x2E, 0x87, 0x4C, 0x27, 0xA7, 0xE1, 0xA6, 0xED, 0x4B, 0xBB, 0xFF, 0x3C, 0xDD, 0xBA, 0xF7, 0x44])
const header_png = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52])


replaceHeader = (data, old_header_len, new_header) => {
    data = data.slice(old_header_len)
    var temp = new Uint8Array(new_header.length + data.length)
    temp.set(new_header, 0)
    temp.set(data, new_header.length)
    return temp
}

decodeAllImage = () => {
    console.log('Decoding images...')
    findExt(game_path, 'rpgmvp').forEach((filepath) => {
        var decoded = replaceHeader(fs.readFileSync(filepath), header_rpgmvp.length, header_png)
        fs.mkdirSync(path.dirname(filepath.replace(game_path, unpack_path)), { recursive: true })
        fs.writeFileSync(filepath.replace(game_path, unpack_path) + '.png', decoded)
    })
    console.log('Done!')
}

encodeAllImage = () => {
    console.log('Encoding images...')
    findExt(unpack_path, 'png').forEach((filepath) => {
        var encoded = replaceHeader(fs.readFileSync(filepath), header_png.length, header_rpgmvp)
        fs.writeFileSync(filepath.replace(unpack_path, game_path).replace('.png',''), encoded)
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
    if(decrypt_key === '') { console.log('Please extract decrypt key first!'); return }

    console.log('Finding encrypted data/scripts...')
    var encryptedList = findAllEncryptedData()
    fs.writeFileSync(ivinfo_path, JSON.stringify(encryptedList, null, 4))

    console.log('Decrypting data/scripts...')
    encryptedList.forEach((encryptType) => {
        encryptType.file_list.forEach((fileInfo) => {
            var decryptedPath = fileInfo.path.replace(game_path, unpack_path) + '.' + encryptType.real_extension
            fs.mkdirSync(path.dirname(decryptedPath), { recursive: true })
            var buff = fs.readFileSync(fileInfo.path)
            var res = decryptData(buff).toString()
            fs.writeFileSync(decryptedPath, res)
        })
    })
    console.log('Done!')
}

encryptAndOverwriteAllData = () => {
    if(decrypt_key === '') { console.log('Please extract decrypt key first!'); return }

    if(!fs.existsSync(ivinfo_path)) { console.log('Please decrypt first!'); return }
    var encryptedList = JSON.parse(fs.readFileSync(ivinfo_path))

    console.log('Encrypting and overwriting data/scripts...')
    encryptedList.forEach((encryptType) => {
        encryptType.file_list.forEach((fileInfo) => {
            var decryptedPath = fileInfo.path.replace(game_path, unpack_path) + '.' + encryptType.real_extension
            var buff = fs.readFileSync(decryptedPath)
            var res = encryptData(buff, fileInfo.iv)
            fs.writeFileSync(fileInfo.path, res)
        })
    })
    console.log('Done!')
}

//----------------------------------------UTILS

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

//--------------------------------------------



switch (process.argv.slice(2)[0]) {
    case 'd': decodeAllImage(); decryptAllData(); break
    case 'e': encodeAllImage(); encryptAndOverwriteAllData(); break
    default: 
        console.log('Please pass an argument:')
        console.log('d: Decrypt all files. Decrypted files are in tools\\unpacked\\ folder.')
        console.log('e: Encrypt and overwrite files. You can edit the decrypted files and then use this function to apply your modification.')
        console.log('e.g. node tools\\\\' + path.basename(__filename) + ' d')
}
