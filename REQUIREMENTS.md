# Entidades do banco de dados

<<<<<<< HEAD
Usuário final do aplicativo, que realiza pedidos e faz pagamentos.


=======
>>>>>>> 8fbf2b12697128912bb6791c090a3bdf97a29360
## Location
  - ID
  - region*
  - city*

Usuário final do aplicativo, que realiza pedidos e faz pagamentos.
## User
  - ID (UUIDv4)
  - IDPerson(id_person)
  - Login*
  - password*
  - avatarUrl

Tabela Relacionada Users e Clients
## Person
  - ID
  - Name*
  - Email*
  - PhoneNumber*

Proprietário do restaurante.
## Client
  - ID
  - IDPerson(id_person)
  - CPF
  - Password
  - AvatarUrl

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
