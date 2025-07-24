#ifndef DATA_H
#define DATA_H

#inclue <QString>
#include <QIcon>

namespace {

/////////////////////////////////
/// 用户信息
/////////////////////////////////
class userInfo {
public:
    QString userId;      // 用户编号
    QString nickname;    // 用户昵称
    QString description; // 用户签名
    QString email;       // 用户邮箱
    QIcon avatar;        // 用户头像

};

/////////////////////////////////
/// 会话信息
/////////////////////////////////
class chatSessionInfo {
public:
    QString chatSessionId;   // 会话编号
    QString chatSessionName; // 会话名字(单聊:对方,群聊:群名)
    Message lastMessage;     // 最新消息
    QIcon avatar;            // 会话头像
};

} // model_namespace

#endif //DATA_H
