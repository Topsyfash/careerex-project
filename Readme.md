# CareerEx Project - Fintech Digital Wallet System

The **CareerEx Project** provides a secure wallet system with features like user-to-user money transfers, transaction history, and wallet balance retrieval. Authentication is handled using bearer tokens.

## Base URL

```
https://careerex-project.onrender.com
```

---

## 🔐 Authentication

All protected routes require a **Bearer Token** in the request headers:

```http
Authorization: Bearer <your_token>
```

---

## 📘 Endpoints

### 1. 💸 Transfer Money

**POST** `/wallet/transfer`

Transfer money from one user to another using their email addresses.

#### Request Body (JSON)
```json
{
  "senderEmail": "fasogbaayomide@gmail.com",
  "receiverEmail": "Jdfash@gmail.com",
  "amount": 1000
}
```

#### Example `curl`
```bash
curl --location 'https://careerex-project.onrender.com/api/wallet/transfer' \
--header 'Authorization: Bearer <your_token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "senderEmail": "fasogbaayomide@gmail.com",
    "receiverEmail": "Jdfash@gmail.com",
    "amount": 1000
}'
```

#### Success Response
```json
{
  "message": "Transfer successful.",
  "senderTransaction": {
    "UserId": "683a7e0848dc388fb94ccbd4",
    "counterpartyId": "6832bd26053b14bc6606aeeb",
    "amount": 1000,
    "type": "debit",
    "date": "2025-06-06T16:08:57.477Z",
    "_id": "68431299fa9aca77d800657d",
    "createdAt": "2025-06-06T16:08:57.478Z",
    "updatedAt": "2025-06-06T16:08:57.478Z",
    "__v": 0
  }
}
```

---

### 2. 📄 Transaction History

**GET** `/wallet/transactions`

Retrieve the logged-in user's transaction history.

#### Example `curl`
```bash
curl --location 'https://careerex-project.onrender.com/api/wallet/transactions' \
--header 'Authorization: Bearer <your_token>'
```

#### Success Response
```json
{
  "Message": "Successful",
  "transactions": [
    {
      "_id": "683a7ee548dc388fb94ccbdd",
      "UserId": "683a7e0848dc388fb94ccbd4",
      "amount": 20000,
      "type": "credit",
      "date": "2025-05-31T04:00:37.841Z"
    }
  ]
}
```

---

### 3. 💰 User Wallet Balance

**GET** `/wallet`

Fetch the current wallet balance of the authenticated user.

#### Example `curl`
```bash
curl --location 'https://careerex-project.onrender.com/api/wallet' \
--header 'Authorization: Bearer <your_token>'
```

#### Success Response
```json
{
  "message": "Successful",
  "balance": 19000
}
```

---

## ⚙️ Setup (for development)

```bash
git clone https://github.com/topsyfash/careerex-project.git
cd careerex-project
npm install
npm run dev
```

### Environment Variables

You need to define the following in a `.env` file:

```env
PORT=8080
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
EMAIL_VERIFICATION_TOKEN=your_email_jwt_secret
EMAIL=your_email_address
EMAIL_PASSWORD=your_email_password
```

---

## Full Documentation URL

```
https://documenter.getpostman.com/view/39957643/2sB2qgddSh
```

