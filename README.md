# OMORI_DECRYPT
This program can decrypt and re-encrypt overwrite all the files (including images, audios, scripts, datas, and save files) of the game OMORI.

Need Node.js

How to Use

1. Copy decrypt.js into OMORI game folder.

2. Run "node decrypt.js d" command inside game root folder to decrypt all files.

3. Modify and view decrypted files as you like. Decrypted files are in the unpacked folder.

4. Run "node decrypt.js e" command inside game root folder to apply your modification.


这个工具能解密并重新加密覆盖OMORI的加密文件（包含图片、声音、代码及数据、存档）

需要Node.js

使用方法：

1. 将decrypt.js复制到OMORI的游戏根目录。

3. 在游戏根目录下执行 node decrypt.js d 命令解密全部文件。

4. 修改和查看解密后的文件，其位于路径 unpacked 下。

5. 在游戏根目录下执行 node decrypt.js e 命令应用修改。


이 프로그램은 OMORI 게임의 모든 파일(이미지, 오디오, 스크립트, 데이터 및 저장 파일 포함)을 암호 해독하고 다시 암호화하여 덮어쓸 수 있습니다.

Node.js가 필요합니다.

사용하는 방법

1. 오모리 폴더 안에 decrypt.js를 복사합니다.

2. 게임 폴더 내에서 "node decrypt.js d" 명령을 실행하여 모든 파일을 복호화하세요.

3. 복호화된 파일을 원하는 대로 수정하고 확인하세요. 해독된 파일은 unpacked 폴더에 있습니다.

4. 게임 루트 폴더 내에서 "node decrypt.js e" 명령을 실행하여 수정 사항을 적용하세요.


Here are some bonuses for make your life easier :P
┌───────────┬─────────────────────────────────┬──────────────────────────────────────────────────────┬──────────────────────────────────────────────────────┐ 
│  USAGE    │ PATH                            │ SEARCH FOR                                           │ CHANGE TO                                            │ 
├───────────┼─────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤ 
│ Max Exp   │ OMORI\www\data\Enemies.json     │ "exp":[0-9]+,                                        │ "exp":999999,                                        │ 
│ I'm SPEED │ OMORI\www\js\rpg_objects.js     │ return this._moveSpeed + (this.isDashing() ? 1 : 0); │ return this._moveSpeed + (this.isDashing() ? 2 : 0); │ 
│ ACHIEVE   │ *                               │ $gameSystem.unlockAchievement(                       │ ---                                                  │
└───────────┴─────────────────────────────────┴──────────────────────────────────────────────────────┴──────────────────────────────────────────────────────┘