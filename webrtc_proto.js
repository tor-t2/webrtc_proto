let https = require( 'https' ); // HTTPSモジュール読み込み
let socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み
let fs = require( 'fs' ); // ファイル入出力モジュール読み込み
let port = 4000;

// 証明書ファイルの設定
let ssl_server_key='server.key';
let ssl_server_crt='server.crt';
let options = {
	key: fs.readFileSync(ssl_server_key),
	cert: fs.readFileSync(ssl_server_crt)
}

// HTTPSサーバーを立てる
let server = https.createServer( options, function( req, res ) {
    res.writeHead(200, { 'Content-Type' : 'text/html' }); // ヘッダ出力
    res.end( fs.readFileSync('./webrtc_proto.html', 'utf-8') );  // index.htmlの内容を出力
}).listen(port);

// HTTPSサーバーをソケットに紐付ける
let io = socketio.listen( server );

// 接続確立後の通信処理部分を定義
io.sockets.on( 'connection', function( socket ) {
    socket.on( 'c2s_message', function( msg ) {
        //-- 自身以外のクライアントに送信
        socket.broadcast.emit( 's2c_message', { value : msg.value } );
    });
});