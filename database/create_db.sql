create database chat;

create user chat_root;

alter user "chat_root" with password 'cauCh7bae3Giebae6AecohThoh9yaixo';

revoke all on database chat from chat_root;
grant connect on database chat to chat_root;


-- psql --username=chat_root --host=localhost chat
