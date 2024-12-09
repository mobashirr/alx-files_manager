# alx-files_manager

in this porject the main goal is to devlop a file manger system
the features that should be implemented

## table of content

- [features]($features)
- [technology]($technology)

## features

- User authentication
-
-

# technology

- redis:
  in memory data store system used for caching and manege session (in this project)

- mongodb
  to setupl mongodb in ubuntu follow this steps:

  1. Step 1: Import the MongoDB Public Key
     Import the MongoDB public key using the recommended apt-key alternative:

  ```
  curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg
  ```

  2. Step 2: Create the MongoDB Repository

  ```
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
  ```

  3. Step 3: Install MongoDB

  ```
  sudo apt update
  sudo apt install -y mongodb-org
  ```

  4. step 4: Start MongoDB

  ```
  sudo systemctl start mongod
  sudo systemctl enable mongod
  ```

  5. step 5: Verify Installation

  ```
  sudo systemctl status mongod
  ```
