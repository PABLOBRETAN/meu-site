# Certificado HTTPS

Este projeto pode usar certificado HTTPS automaticamente pelo GitHub Pages.

## O que o certificado faz

O certificado HTTPS permite que o site abra com cadeado de seguranca no navegador, usando um endereco que comeca com:

```text
https://
```

Ele ajuda a proteger a conexao entre o visitante e o site.

## GitHub Pages

Quando o site e publicado em um endereco do GitHub Pages, como:

```text
https://pablobretan.github.io/meu-site/
```

o GitHub normalmente fornece o certificado HTTPS automaticamente.

## Como ativar ou verificar

1. Acesse o repositorio no GitHub.
2. Entre em `Settings`.
3. Abra `Pages`.
4. Verifique se o site esta publicado.
5. Marque a opcao `Enforce HTTPS`, se ela estiver disponivel.
6. Abra o site usando `https://`.
7. Confira se o navegador mostra o cadeado de seguranca.

## Se usar dominio proprio

Se o site usar um dominio proprio, por exemplo:

```text
https://seudominio.com.br
```

configure primeiro o DNS do dominio apontando para o GitHub Pages. Depois volte em `Settings > Pages` e aguarde o GitHub emitir o certificado.

Pode levar alguns minutos ou horas para o certificado ficar disponivel.

## Importante

Nao e recomendado colocar arquivos de certificado privado dentro do repositorio, como:

- `.key`
- `.pem`
- senhas
- chaves privadas

Para GitHub Pages, o certificado deve ser gerenciado pela propria plataforma.
