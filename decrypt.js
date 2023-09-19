var LZString={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",_f:String.fromCharCode,compressToBase64:function(e){if(e==null)return"";var t="";var n,r,i,s,o,u,a;var f=0;e=LZString.compress(e);while(f<e.length*2){if(f%2==0){n=e.charCodeAt(f/2)>>8;r=e.charCodeAt(f/2)&255;if(f/2+1<e.length)i=e.charCodeAt(f/2+1)>>8;else i=NaN}else{n=e.charCodeAt((f-1)/2)&255;if((f+1)/2<e.length){r=e.charCodeAt((f+1)/2)>>8;i=e.charCodeAt((f+1)/2)&255}else r=i=NaN}f+=3;s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+LZString._keyStr.charAt(s)+LZString._keyStr.charAt(o)+LZString._keyStr.charAt(u)+LZString._keyStr.charAt(a)}return t},decompressFromBase64:function(e){if(e==null)return"";var t="",n=0,r,i,s,o,u,a,f,l,c=0,h=LZString._f;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(c<e.length){u=LZString._keyStr.indexOf(e.charAt(c++));a=LZString._keyStr.indexOf(e.charAt(c++));f=LZString._keyStr.indexOf(e.charAt(c++));l=LZString._keyStr.indexOf(e.charAt(c++));i=u<<2|a>>4;s=(a&15)<<4|f>>2;o=(f&3)<<6|l;if(n%2==0){r=i<<8;if(f!=64){t+=h(r|s)}if(l!=64){r=o<<8}}else{t=t+h(r|i);if(f!=64){r=s<<8}if(l!=64){t+=h(r|o)}}n+=3}return LZString.decompress(t)},compressToUTF16:function(e){if(e==null)return"";var t="",n,r,i,s=0,o=LZString._f;e=LZString.compress(e);for(n=0;n<e.length;n++){r=e.charCodeAt(n);switch(s++){case 0:t+=o((r>>1)+32);i=(r&1)<<14;break;case 1:t+=o(i+(r>>2)+32);i=(r&3)<<13;break;case 2:t+=o(i+(r>>3)+32);i=(r&7)<<12;break;case 3:t+=o(i+(r>>4)+32);i=(r&15)<<11;break;case 4:t+=o(i+(r>>5)+32);i=(r&31)<<10;break;case 5:t+=o(i+(r>>6)+32);i=(r&63)<<9;break;case 6:t+=o(i+(r>>7)+32);i=(r&127)<<8;break;case 7:t+=o(i+(r>>8)+32);i=(r&255)<<7;break;case 8:t+=o(i+(r>>9)+32);i=(r&511)<<6;break;case 9:t+=o(i+(r>>10)+32);i=(r&1023)<<5;break;case 10:t+=o(i+(r>>11)+32);i=(r&2047)<<4;break;case 11:t+=o(i+(r>>12)+32);i=(r&4095)<<3;break;case 12:t+=o(i+(r>>13)+32);i=(r&8191)<<2;break;case 13:t+=o(i+(r>>14)+32);i=(r&16383)<<1;break;case 14:t+=o(i+(r>>15)+32,(r&32767)+32);s=0;break}}return t+o(i+32)},decompressFromUTF16:function(e){if(e==null)return"";var t="",n,r,i=0,s=0,o=LZString._f;while(s<e.length){r=e.charCodeAt(s)-32;switch(i++){case 0:n=r<<1;break;case 1:t+=o(n|r>>14);n=(r&16383)<<2;break;case 2:t+=o(n|r>>13);n=(r&8191)<<3;break;case 3:t+=o(n|r>>12);n=(r&4095)<<4;break;case 4:t+=o(n|r>>11);n=(r&2047)<<5;break;case 5:t+=o(n|r>>10);n=(r&1023)<<6;break;case 6:t+=o(n|r>>9);n=(r&511)<<7;break;case 7:t+=o(n|r>>8);n=(r&255)<<8;break;case 8:t+=o(n|r>>7);n=(r&127)<<9;break;case 9:t+=o(n|r>>6);n=(r&63)<<10;break;case 10:t+=o(n|r>>5);n=(r&31)<<11;break;case 11:t+=o(n|r>>4);n=(r&15)<<12;break;case 12:t+=o(n|r>>3);n=(r&7)<<13;break;case 13:t+=o(n|r>>2);n=(r&3)<<14;break;case 14:t+=o(n|r>>1);n=(r&1)<<15;break;case 15:t+=o(n|r);i=0;break}s++}return LZString.decompress(t)},compressToUint8Array:function(e){var t=LZString.compress(e);var n=new Uint8Array(t.length*2);for(var r=0,i=t.length;r<i;r++){var s=t.charCodeAt(r);n[r*2]=s>>>8;n[r*2+1]=s%256}return n},decompressFromUint8Array:function(e){if(e===null||e===undefined){return LZString.decompress(e)}else{var t=new Array(e.length/2);for(var n=0,r=t.length;n<r;n++){t[n]=e[n*2]*256+e[n*2+1]}return LZString.decompress(String.fromCharCode.apply(null,t))}},compressToEncodedURIComponent:function(e){return LZString.compressToBase64(e).replace(/=/g,"$").replace(/\//g,"-")},decompressFromEncodedURIComponent:function(e){if(e)e=e.replace(/$/g,"=").replace(/-/g,"/");return LZString.decompressFromBase64(e)},compress:function(e){if(e==null)return"";var t,n,r={},i={},s="",o="",u="",a=2,f=3,l=2,c="",h=0,p=0,d,v=LZString._f;for(d=0;d<e.length;d+=1){s=e.charAt(d);if(!Object.prototype.hasOwnProperty.call(r,s)){r[s]=f++;i[s]=true}o=u+s;if(Object.prototype.hasOwnProperty.call(r,o)){u=o}else{if(Object.prototype.hasOwnProperty.call(i,u)){if(u.charCodeAt(0)<256){for(t=0;t<l;t++){h=h<<1;if(p==15){p=0;c+=v(h);h=0}else{p++}}n=u.charCodeAt(0);for(t=0;t<8;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}else{n=1;for(t=0;t<l;t++){h=h<<1|n;if(p==15){p=0;c+=v(h);h=0}else{p++}n=0}n=u.charCodeAt(0);for(t=0;t<16;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}a--;if(a==0){a=Math.pow(2,l);l++}delete i[u]}else{n=r[u];for(t=0;t<l;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}a--;if(a==0){a=Math.pow(2,l);l++}r[o]=f++;u=String(s)}}if(u!==""){if(Object.prototype.hasOwnProperty.call(i,u)){if(u.charCodeAt(0)<256){for(t=0;t<l;t++){h=h<<1;if(p==15){p=0;c+=v(h);h=0}else{p++}}n=u.charCodeAt(0);for(t=0;t<8;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}else{n=1;for(t=0;t<l;t++){h=h<<1|n;if(p==15){p=0;c+=v(h);h=0}else{p++}n=0}n=u.charCodeAt(0);for(t=0;t<16;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}a--;if(a==0){a=Math.pow(2,l);l++}delete i[u]}else{n=r[u];for(t=0;t<l;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}a--;if(a==0){a=Math.pow(2,l);l++}}n=2;for(t=0;t<l;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}while(true){h=h<<1;if(p==15){c+=v(h);break}else p++}return c},decompress:function(e){if(e==null)return"";if(e=="")return null;var t=[],n,r=4,i=4,s=3,o="",u="",a,f,l,c,h,p,d,v=LZString._f,m={string:e,val:e.charCodeAt(0),position:32768,index:1};for(a=0;a<3;a+=1){t[a]=a}l=0;h=Math.pow(2,2);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}switch(n=l){case 0:l=0;h=Math.pow(2,8);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}d=v(l);break;case 1:l=0;h=Math.pow(2,16);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}d=v(l);break;case 2:return""}t[3]=d;f=u=d;while(true){if(m.index>m.string.length){return""}l=0;h=Math.pow(2,s);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}switch(d=l){case 0:l=0;h=Math.pow(2,8);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}t[i++]=v(l);d=i-1;r--;break;case 1:l=0;h=Math.pow(2,16);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}t[i++]=v(l);d=i-1;r--;break;case 2:return u}if(r==0){r=Math.pow(2,s);s++}if(t[d]){o=t[d]}else{if(d===i){o=f+f.charAt(0)}else{return null}}u+=o;t[i++]=f+o.charAt(0);r--;f=o;if(r==0){r=Math.pow(2,s);s++}}}};if(typeof module!=="undefined"&&module!=null){module.exports=LZString}

var key = ["a7", "d7", "02", "60", "aa", "eb", "bc", "e7", "4b", "bb", "ff", "31", "94", "f2", "b3", "16"]

const crypto = require("crypto")
const path = require("path")
const fs = require("fs")

const game_path = path.join(__dirname, '\\www\\')
const unpack_path = path.join(__dirname, '\\unpacked\\')
const ivinfo_path = path.join(__dirname, '\\unpacked\\ivinfo.json')

const game_audio_path = path.join(__dirname, '\\www\\audio\\')
const unpack_audio_path = path.join(__dirname, '\\unpacked\\audio\\')

const game_savefile_path = path.join(__dirname, '\\www\\save\\')
const unpack_savefile_path = path.join(__dirname, '\\unpacked\\save\\')

//------------------------AUDIOS

const header_rpgmv = new Uint8Array([0x52, 0x50, 0x47, 0x4D, 0x56, 0x00, 0x00, 0x00, 0x00, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00])

decodeAllAudio = () => {
    console.log('Decrypting audio files...')
    unpackrepack(game_audio_path, 'rpgmvo', unpack_audio_path, 'ogg', (filedata) => {
        var decoded = replaceHeader(filedata, header_rpgmv.length)
        for (var i = 0; i < 16; i++) decoded[i] = decoded[i] ^ parseInt(key[i], 16)
        return decoded
    })
    console.log('Done!')
}

encodeAllAudio = () => {
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
        var decoded = decompressFromBase64(fs.readFileSync(filepath, {encoding:'utf8'}))
        fs.mkdirSync(path.dirname(filepath.replace(game_savefile_path, unpack_savefile_path)), { recursive: true })
        fs.writeFileSync(filepath.replace(game_savefile_path, unpack_savefile_path).replace('.rpgsave','.json'), decoded)
    })
    console.log('Done!')
}

encodeAllSave = () => {
    console.log('Encoding and overwriting save files...')
    findExt(unpack_savefile_path, 'json').forEach((filepath) => {
        var encoded = compressToBase64(fs.readFileSync(filepath).toString())
        fs.writeFileSync(filepath.replace(unpack_savefile_path, game_savefile_path).replace('.json','.rpgsave'), encoded)
    })
    console.log('Done!')
}

//------------------------IMAGES
decodeAllImage = () => {
    console.log('Decoding images...')
    unpackrepack(game_path, 'rpgmvp', unpack_path, 'png', (filedata) => {
        var decoded = replaceHeader(filedata, header_rpgmv.length)
        for (var i = 0; i < 16; i++) decoded[i] = decoded[i] ^ parseInt(key[i], 16)
        return decoded
    })
    console.log('Done!')
}

encodeAllImage = () => {
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
    var d = crypto.createDecipheriv("aes-256-ctr", "6bdb2e585882fbd48826ef9cffd4c511", iv)
    return Buffer.concat([d.update(data), d.final()])
}

encryptData = (data, ivHex) => {
    var iv = Buffer.from(ivHex, 'hex')
    var e = crypto.createCipheriv("aes-256-ctr", "6bdb2e585882fbd48826ef9cffd4c511", iv)
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
        { extension : 'xlsx'  , real_extension : 'xlsx', file_list : fileListWithIVInfo(findExt(game_path, 'xlsx'  ))},
        { extension : 'OMORI' , real_extension : 'js'  , file_list : fileListWithIVInfo(findExt(game_path, 'OMORI' ))},
        { extension : 'KEL'   , real_extension : 'json', file_list : fileListWithIVInfo(findExt(game_path, 'KEL'   ))},
        { extension : 'HERO'  , real_extension : 'yaml', file_list : fileListWithIVInfo(findExt(game_path, 'HERO'  ))},
        { extension : 'AUBREY', real_extension : 'json', file_list : fileListWithIVInfo(findExt(game_path, 'AUBREY'))},
        { extension : 'PLUTO' , real_extension : 'yaml', file_list : fileListWithIVInfo(findExt(game_path, 'PLUTO' ))},
    ]
    return encrypt
}

decryptAllData = () => {
    console.log('Finding encrypted data/scripts...')
    var encryptedList = findAllEncryptedData()
    if (!fs.existsSync(unpack_path)) {fs.mkdirSync(unpack_path);}
    fs.writeFileSync(ivinfo_path, JSON.stringify(encryptedList, null, 4))

    console.log('Decrypting data/scripts...')
    encryptedList.forEach((encryptType) => {
        encryptType.file_list.forEach((fileInfo) => {
            var decryptedPath = fileInfo.path.replace(game_path, unpack_path).replace('.'+encryptType.extension, '.'+encryptType.real_extension)
            fs.mkdirSync(path.dirname(decryptedPath), { recursive: true })
            var buff = fs.readFileSync(fileInfo.path)
            var res = decryptData(buff)
            fs.writeFileSync(decryptedPath, res)
        })
    })
    fs.copyFileSync(path.join(__dirname, '\\www\\js\\plugins.js'), path.join(__dirname, '\\unpacked\\js\\plugins.js'))
    fs.writeFileSync(path.join(__dirname, '\\unpacked\\OMORI.rpgproject'), 'RPGMV 1.6.1', 'utf-8')
    console.log('Done!')
}

encryptAllData = () => {
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
    fs.copyFileSync(path.join(__dirname, '\\unpacked\\js\\plugins.js'), path.join(__dirname, '\\www\\js\\plugins.js'))
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
    case 'd': decryptAllData(); decodeAllAudio(); decodeAllImage(); break
    case 'e': encryptAllData(); encodeAllAudio(); encodeAllImage(); break
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
        console.log('d: Decrypt all mentioned above except save files.')
        console.log('e: Encrypt and overwrite all mentioned above except save files.')
        console.log('Decrypted files are located in \'tools\\unpacked\\\' folder.')
        console.log('You can edit the decrypted files and then encrypt to apply your modification.')
        console.log('e.g. node tools\\' + path.basename(__filename) + ' ds')
}
