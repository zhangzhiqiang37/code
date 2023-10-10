# 生成.crt和.key文件，设备安装.crt证书文件，服务端https读取.crt和.key文件

#!/bin/sh

printf "[req]
default_bits            = 4096
default_md              = sha256
prompt                  = no
encrypt_key             = no
string_mask = utf8only

distinguished_name      = cert_distinguished_name
req_extensions          = req_x509v3_extensions

#将下面的信息替换成你的信息
[ cert_distinguished_name ]
C  = CN
ST = GD
L  = GZ 
O  = Tencent
OU = WXG
CN = mp.weixin.qq.com

[req_x509v3_extensions]
basicConstraints = critical,CA:true
subjectKeyIdentifier    = hash
keyUsage = critical,digitalSignature,keyCertSign,cRLSign #,keyEncipherment
extendedKeyUsage  = critical,serverAuth #, clientAuth
subjectAltName=@alt_names

#将下面的信息替换成你的信息
[alt_names]
DNS.1 = *.mp.weixin.qq.com
DNS.2 = *.api.mp.weixin.qq.com
DNS.3 = mp.weixin.qq.com

">ca_cert.conf

#将下面的信息替换成你的信息
key_file=mp.weixin.qq.com.key
tmp_cert_file=tmp_mp.weixin.qq.com.crt
csr_file=mp.weixin.qq.com.csr
cert_file=mp.weixin.qq.com.crt

#openssl genrsa  -out $key_file 2048
openssl ecparam  -out $key_file -name prime256v1 -genkey

openssl req -new -sha256 -x509 -days 7300  -config ca_cert.conf -extensions req_x509v3_extensions -key $key_file -out $cert_file

openssl x509 -in $cert_file  -serial -noout
openssl verify -verbose  -CAfile $cert_file $cert_file

exit
#keytool -printcert -v  -file $cert_file

openssl s_server    -cert  $cert_file -key $key_file -CAfile $cert_file -Verify 3 -accept 4430 -www  &
pid=$$
#将下面的信息替换成你的信息
echo 'GET /HTTP/1.1'|openssl s_client -connect www.mp.weixin.qq.com:4430 -cert $cert_file -key $key_file -CAfile $cert_file
kill $$
