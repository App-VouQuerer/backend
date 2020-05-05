# Entidades do banco de dados


Qual a finalidade desta tabela?
## Location
  - ID
  - region*
  - city*

Cargo dos usuários.
## Roles
 - name: String
 - title: String
 - default: Boolean

Usuário final do aplicativo, que realiza pedidos e faz pagamentos.
## User
  - ID (UUIDv4)
  - Person (person_id)
  - name*: String
  - email*: String
  - password*: String

Tabela para armazenar dados pessoais dos usuários ou clientes.
## Person
  - ID (UUIDv4)
  - cpf: String
  - fullName: String
  - phoneNumber: String
  - avatarUrl: String

Proprietário do restaurante.
## Client
  - ID (UUIDv4)
  - Person (person_id)
  - email: String
  - password: String

Endereços de usuários, proprietários ou restaurantes.
## Address
  - ID (UUIDv4)
  - street: String
  - number: String
  - district: String
  - complement: String
  - city: String
  - state: String
  - zipCode: String
  - latitude: Number
  - longitude: Number
  - Client (client_id)
  - User (user_id)
  - Restaurant (restaurant_id)

Estabelecimento, ou restaurante, com dados da empresa, razão social, nome fantasia, proprietário, endereço.
## Restaurant
  - ID (UUIDv4)
  - socialName: String -- (Razão Social)
  - displayName: String -- (Nome Fantasia)
  - cnpj: String
  - description: String
  - logoUrl: String
  - latitude: Number
  - longitude: Number

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
  - IDCategory (id_category)
  - title: String
  - description: Text
  - photoUrl: String
  - price: Decimal -- Preço normal
  - discountPrice: Decimal -- Preço de desconto
  - hasDiscount: Boolean -- Está em desconto?

Categorias dos produtos.
## ProductCategory
  - ID
  - Name
