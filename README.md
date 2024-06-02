# Hướng dẫn deploy web Health_Insurance lên AWS
## Bước 1: Tạo một máy ảo trên dịch vụ EC2 của AWS
- Trong giao diện điều khiển, tìm và chọn dịch vụ "EC2" trong danh sách các dịch vụ của AWS
- Bấm vào nút "Launch Instance" để bắt đầu quá trình tạo instance mới.
- Đặt tên cho máy ảo (Web-Health-Insurance)
- Chọn AMI muốn sử dụng (Amazon Linux AMI 2023)
- Chọn loại instance(t2.micro)
- Chọn key pair (login): Vockey (type: rsa)
- Kiểm tra lại tất cả cài đặt và tùy chọn đã chọn. Sau đó, nhấn vào nút "Launch instance" để bắt đầu tạo máy ảo.
  
## Bước 2: Connect to instance 
- Select vào máy ảo vừa tạo, tiếp theo nhấn vào Connect ở phía trên
- Chọn EC2 Instance Connect, sau đó nhấn Connect

## Bước 3: Cấu hình cho các thư viện cần thiết của dự án

### Cấu hình database (MongoDB)
- Di chuyển đến thư mục /etc/yum.repos.d
  
  ```bash
  cd /etc/yum.repos.d
- Tạo một tập tin có tên là "mongodb-org-7.0.repo" trong thư mục hiện tại
  ```bash
  sudo touch mongodb-org-7.0.repo
- Mở tập tin "mongodb-org-7.0.repo" bằng trình soạn thảo nano
  ```bash
  sudo nano mongodb-org-7.0.repo
- Sau khi mở trình soạn thảo, gõ đoạn mã dưới đây rồi lưu lại:
  ```bash 
   [mongodb-org-7.0]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/7.0/x86_64/
   gpgcheck=1
   enabled=1
   gpgkey=https://pgp.mongodb.com/server-7.0.asc
- Install the MongoDB packages
  ```bash
  sudo yum install -y mongodb-org
- Start MongoDB
  ```bash
  sudo systemctl start mongod
- Verify that MongoDB has started successfully
  ```bash
  sudo systemctl status mongod
- Stop MongoDB
  ```bash
  sudo systemctl stop mongod
- Restart MongoDB.
  ```bash
  sudo systemctl restart mongod
- Begin using MongoDB
  ```bash
  mongosh
- Create My database
  ```bash
   db.createUser(
    {
        user: "admin",
        pwd:  passwordPrompt(),  
        roles: [ { role: "readWrite", db: "mydatabase" },
                { role: "read", db: "mydatabase" } ]
    }
   )
- Mở tập tin "/etc/mongod.conf" bằng trình soạn thảo nano:
  ```bash
  sudo nano /etc/mongod.conf
- Sau khi mở trình soạn thảo, sửa lại 2 dòng  đoạn mã như dưới đây rồi lưu lại:
  ```bash
  net:
    port: 27017
    bindIp: 0.0.0
- Restart và kiểm tra lại trạng thái của mongod:
  ```bash
    sudo systemctl restart mongod
    sudo systemctl status mongod
    sudo systemctl enable mongod
    sudo systemctl stop mongod 
    sudo systemctl restart mongod
- Kết nối tới cơ sở dữ liệu MongoDB từ một máy khách MongoDB Shell (mongosh).
  ```bash
  mongosh -u user -p password Public-IPv4-address/mydatabase
- Tải xuống MongoDB từ trình duyệt và connect đến MongoDB
  ```bash
  mongodb://user:passwork@Public-IPv4-address/mydatabase?directConnection=true&appName=mongosh+2.2.6
### Cấu hình NodeJS, Git
- Thiết lập NodeSource Repository
  ```bash
  curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
- Cài đặt Node.js
  ```bash
  sudo dnf install nodejs -y
- Cài đặt Git
  ```bash
  sudo yum install -y git
- Cài đặt npm
  ```bash
  sudo npm install
- Clone dự án từ github về
  ```bash
  git clone https://github.com/Ho-DucThanh/Web-Health-Insurance.git
- Di chuyển đến dự án
  ```bash
  cd Web-Health-Insurance
- Chạy dự án
  ```bash
  npm start
## Bước 4: Tạo Port range cho Dự án và Database
- Ở menu bên trái, dưới mục "Network & Security", chọn "Security Groups"
- Select "Security group name" cần sửa
- Chọn "Inbound rules", sau đó nhấn "Edit inbound rules"
- Chọn "Add rule" sau đó điền như sau:
- Type: "Custom TCP", Protocol: "TCP", Port range: 27017 cho database và 3000 cho localhost, IP: 0.0.0.0
- Cuối cùng nhấn Save rules


  






