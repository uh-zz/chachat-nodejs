var chatDom = [];

var p = function(dom) {
    chatDom.push(dom);
};

// チャットの外側部分  
p('<div id="kdchat_message_container">');

    {/* ヘッダー部分  */}
    p('<div id="kdchat_chat_header">');
        p('<div id="kdchat_chat_user_status">');
            p('<div id="kdchat_status_icon">●</div>');
            p('<div id="kdchat_chat_user_name">うえはら</div>');
        p('</div>');
    p('</div>');

    {/* タイムライン部分  */}
    p('<div id="kdchat_messages">');
    p('</div>');

    {/* テキストボックス、送信ボタン  */}
    p('<form id="kdhcat_send" action="">');
        p('<input id="kdchat_send_message" autocomplete="off">');
        p('<button id="kdchat_send_btn">submit</button>');
    p('</form>');

    $('#kdchat_container').append(chatDom.join(''));

