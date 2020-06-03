#!/bin/sh
printf "[req]
default_bits            = 4096
default_md              = sha256
prompt                  = no
encrypt_key             = no
string_mask = utf8only
distinguished_name      = cert_distinguished_name
req_extensions          = req_x509v3_extensions
[ cert_distinguished_name ]
C  = CN
ST = GD
L  = GZ
O  = Tencent
OU = WXG
CN = wechatauthdemo.com
[req_x509v3_extensions]
basicConstraints = critical,CA:true
subjectKeyIdentifier    = hash
keyUsage = critical,digitalSignature,keyCertSign,cRLSign #,keyEncipherment
extendedKeyUsage  = critical,serverAuth #, clientAuth
subjectAltName=@alt_names
[alt_names]
DNS.1 = *.wechatauthdemo.com
DNS.2 = *.api.wechatauthdemo.com
DNS.3 = wechatauthdemo.com
">ca_cert.conf
key_file=wechatauthdemo.com.key
tmp_cert_file=tmp_wechatauthdemo.com.crt
csr_file=wechatauthdemo.com.csr
cert_file=wechatauthdemo.com.crt
#openssl genrsa  -out $key_file 2048
openssl ecparam  -out $key_file -name prime256v1 -genkey
openssl req -new -sha256 -x509 -days 7300  -config ca_cert.conf -extensions req_x509v3_extensions -key $key_file -out $cert_file
openssl x509 -in $cert_file  -serial -noout
openssl verify -verbose  -CAfile $cert_file $cert_file
exit
#keytool -printcert -v  -file $cert_file
openssl s_server    -cert  $cert_file -key $key_file -CAfile $cert_file -Verify 3 -accept 4430 -www  &
pid=$$
echo 'GET /HTTP/1.1'|openssl s_client -connect www.wechatauthdemo.com:4430 -cert $cert_file -key $key_file -CAfile $cert_file
kill $$
 
