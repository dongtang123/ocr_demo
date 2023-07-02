import mysql.connector

def add_data_to_mysql():
    # 连接到 MySQL 数据库
    connection = mysql.connector.connect(
        host="106.13.12.84",
        user="cjm",
        password="hF42bj56EhJermDp",
        database="cjm"
    )

    # 创建一个游标对象，用于执行 SQL 语句
    cursor = connection.cursor()

    # # 定义要插入的数据
    # name = "John"
    # age = 30
    # email = "john@example.com"

    # 定义插入数据的 SQL 语句
    sql = "INSERT INTO your_table (name, age, email) VALUES (%s, %s, %s)"

    # 执行 SQL 语句，将数据插入到数据库中
    cursor.execute("INSERT INTO main (file_name, ocr_result, cor_result) VALUES (%s, %s, %s)"%("1", "2", "4"))

    # 提交事务，确保数据插入生效
    connection.commit()
    last_inserted_id = cursor.lastrowid
    print("Last inserted ID:", last_inserted_id)
    # 关闭游标和数据库连接
    cursor.close()
    connection.close()

# 使用示例
add_data_to_mysql()
