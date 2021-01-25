
How to Use


1. Copy All Contents from this folder into OMORI game folder(should overwrite something).

2. Run game, DECRYPT KEY should appear on the top left corner of the game window.

3. Write DECRYPT KEY into tools\\decrypt.js's decrypt_key variable.

4. Run "node tools\\decrypt.js d" command inside game root folder to decrypt all files.

5. Modify and view decrypted files as you like. Decrypted files are in the same folder with the encrypted files and with word 'decipher' in file name.

6. Run "node tools\\decrypt.js e" command inside game root folder to apply your modification.


这个工具能解密OMORI的加密文件，使用方法：

1. 将该文件夹下全部内容复制到OMORI的游戏根目录（会提示覆盖文件）。

2. 执行游戏，DECRYPT KEY 会显示在游戏界面左上角。

3. 抄写 DECRYPT KEY 的值到 tools\\decrypt.js 的 decrypt_key 变量中。

4. 在游戏根目录下执行 node tools\\decrypt.js d 命令解密。

5. 修改和查看解密后的文件，其和对应的加密文件位于同一路径下，文件名包含单词 decipher。

6. 在游戏根目录下执行 node tools\\decrypt.js e 命令应用修改。