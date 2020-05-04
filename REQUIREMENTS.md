# Entidades do banco de dados

Usuário final do aplicativo, que realiza pedidos e faz pagamentos.

## Location
  - ID (UUIDv4)
  - region*
  - city*

## User
  - ID (UUIDv4)
  - name*
  - email*
  - password*
  - avatarUrl
  - phoneNumber

Proprietário do restaurante.
## Client
  - ID
  - cpf
  - name
  - email
  - password
  - avatarUrl
  - phoneNumber

Endereços de usuários, proprietários ou restaurantes.
## Address
  - ID
  - street
  - number
  - district
  - complement
  - city
  - state
  - zipCode
  - Client (client_id)
  - User (user_id)
  - Restaurant (restaurant_id)

Estabelecimento, ou restaurante, com dados da empresa, razão social, nome fantasia, proprietário, endereço.
## Restaurant
  - ID
  - socialName (Razão Social)
  - displayName (Nome Fantasia)
  - cnpj
  - description
  - logoUrl
  - latitude
  - longitude

Período de funcionamento dos restaurantes, incluindo dia, horário de abertura e fechamento do estabelecimento.
## WorkPeriod
  - ID
  - Restaurant (restaurant_id)
  - workDay: Date
  - openAt: Time
  - closedAt: Time

Produtos, como sanduíches, pizzas ou outros alimentos, e bebidas que um restaurante oferece.
## Product
  - ID: UUIDv4
  - title: String
  - description: Text
  - photoUrl: String
  - price: Decimal -- Preço normal
  - discountPrice: Decimal -- Preço de desconto
  - hasDiscount: Boolean -- Está em desconto?
