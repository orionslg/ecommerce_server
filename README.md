# E-Commerce Server

Base url: <http://localhost:3000>

## **Get categories**

Returns json categories

-   **URL**

    /category

-   **Method:**

    `GET`

-   **URL Params**

    None

-   **Data Params**

    None

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        [
          {
            "id": 11,
            "name": "Drinks",
            "createdAt": "2020-03-21T13:55:42.487Z",
            "updatedAt": "2020-03-21T15:23:17.600Z",
            "Products": [
              {
                "id": 15,
                "name": "Energen",
                "image_url": "abcd",
                "price": 20000,
                "stock": 30,
                "description": "Test",
                "CategoryId": 11,
                "createdAt": "2020-03-21T15:17:17.735Z",
                "updatedAt": "2020-03-21T15:17:17.735Z"
              },
              {
                "id": 13,
                "name": "Dancow",
                "image_url": "http://danc.ow",
                "price": 20000,
                "stock": 200,
                "description": "Susu terbaik",
                "CategoryId": 11,
                "createdAt": "2020-03-21T13:56:10.012Z",
                "updatedAt": "2020-03-21T13:56:10.012Z"
              }
            ]
          },
          {
            "id": 12,
            "name": "Drugs",
            "createdAt": "2020-03-21T14:10:05.574Z",
            "updatedAt": "2020-03-23T15:53:35.975Z",
            "Products": [
              {
                "id": 14,
                "name": "Snickers",
                "image_url": "snickers.com",
                "price": 20000,
                "stock": 6,
                "description": "abcwe",
                "CategoryId": 12,
                "createdAt": "2020-03-21T14:10:35.413Z",
                "updatedAt": "2020-03-21T15:25:11.967Z"
              }
            ]
          },
          {
            "id": 15,
            "name": "Computers",
            "createdAt": "2020-03-23T15:57:32.002Z",
            "updatedAt": "2020-03-23T15:57:32.002Z",
            "Products": []
          }
        ]
        ```

-   **Error Response:**

    -   **Code:** 500 INTERNAL SERVER ERROR <br />
        **Content:**
        ```json
        {
          "message": "Internal Server Error"
        }
        ```

## **Get category**

Returns json category

-   **URL**

    /category/:id

-   **Method:**

    `GET`

-   **URL Params**

    None

-   **Data Params**

     **Required:**

    `id=[integer]`

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        {
          "id": 11,
          "name": "Drinks",
          "createdAt": "2020-03-21T13:55:42.487Z",
          "updatedAt": "2020-03-21T15:23:17.600Z",
          "Products": [
            {
              "id": 13,
              "name": "Dancow",
              "image_url": "http://danc.ow",
              "price": 20000,
              "stock": 200,
              "description": "Susu terbaik",
              "CategoryId": 11,
              "createdAt": "2020-03-21T13:56:10.012Z",
              "updatedAt": "2020-03-21T13:56:10.012Z"
            },
            {
              "id": 15,
              "name": "Energen",
              "image_url": "abcd",
              "price": 20000,
              "stock": 30,
              "description": "Test",
              "CategoryId": 11,
              "createdAt": "2020-03-21T15:17:17.735Z",
              "updatedAt": "2020-03-21T15:17:17.735Z"
            }
          ]
        }
        ```

-   **Error Response:**

    -   **Code:** 500 INTERNAL SERVER ERROR <br />
        **Content:**
        ```json
        {
          "message": "Internal Server Error"
        }
        ```
    -   **Code:** 404 NOT FOUND <br />
        **Content:**
        ```json
        {
          "errors": [
            "Category not found"
          ],
          "message": "Not found"
        }
        ```

## **Create category**

  Returns json data when admin create category

- **Headers**

    Authorization: `<access_token>`

-   **URL**

    /category

-   **Method:**

    `POST`

-   **URL Params**

    None

-   **Data Params**

    **Required:**

    `name=[string]`

-   **Success Response:**

    -   **Code:** 201 <br />
        **Content:**
        ```json
        {
          "id": 15,
          "name": "Computers",
          "updatedAt": "2020-03-23T15:57:32.002Z",
          "createdAt": "2020-03-23T15:57:32.002Z"
        }
        ```

-   **Error Response:**

    -   **Code:** 400 BAD REQUEST <br />
        **Content:**
        ```json
        {
          "errors": [
            "Category name is required"
          ],
          "message": "Bad Request"
        }
        ```
     -  **Code:** 401 UNAUTHORIZED <br />
        **Content:**

        ```json
        {
          "errors": [
            "Please login first"
          ],
          "message": "Unauthorized"
        }
        ```
      -  **Code:** 401 UNAUTHORIZED <br />
        **Content:**

          ```json
          {
            "errors": [
              "Admin access required"
            ],
            "message": "Unauthorized"
          }
          ```


## **Update Category**

  Returns json data when admin update category by id

- **Headers**

    Authorization: `<access_token>`

-   **URL**

    /category/:id

-   **Method:**

    `PUT`

-   **URL Params**

    **Required:**

    `id=[integer]`

-   **Data Params**

    `name=[string]`

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        {
          "id": 12,
          "name": "Drugs",
          "createdAt": "2020-03-21T14:10:05.574Z",
          "updatedAt": "2020-03-23T15:53:35.975Z"
        }
        ```

-   **Error Response:**

     -  **Code:** 400 BAD REQUEST <br />
        **Content:**
        ```json
        {
          "errors": [
            "Category name is required"
          ],
          "message": "Bad Request"
        }
        ```

    -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Please login first"
          ],
          "message": "Unauthorized"
        }
        ```
    -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Admin access required"
          ],
          "message": "Unauthorized"
        }
        ```

## **Delete Category**

  Returns json data when admin delete category by id

- **Headers**

    Authorization: `<access_token>`

-   **URL**

    /category/:id

-   **Method:**

    `DELETE`

-   **URL Params**

    **Required:**

    `id=[integer]`

-   **Data Params**

    None

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        {
          "message": "Success deleting category 14"
        }
        ```

-   **Error Response:**

     -  **Code:** 404 NOT FOUND <br />
        **Content:**
        ```json
        {
          "errors": [
            "Category not found"
          ],
          "message": "Not found"
        }
        ```
   -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Please login first"
          ],
          "message": "Unauthorized"
        }
        ```
  -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Admin access required"
          ],
          "message": "Unauthorized"
        }
        ```

## **Get Products**

  Returns json products

-   **URL**

    /product

-   **Method:**

    `GET`

-   **URL Params**

    None

-   **Data Params**

    None

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        [
          {
            "id": 15,
            "name": "Energen",
            "image_url": "abcd",
            "price": 20000,
            "stock": 30,
            "description": "Test",
            "CategoryId": 11,
            "createdAt": "2020-03-21T15:17:17.735Z",
            "updatedAt": "2020-03-21T15:17:17.735Z",
            "Category": {
              "id": 11,
              "name": "Drinks",
              "createdAt": "2020-03-21T13:55:42.487Z",
              "updatedAt": "2020-03-21T15:23:17.600Z"
            }
          },
          {
            "id": 13,
            "name": "Dancow",
            "image_url": "http://danc.ow",
            "price": 20000,
            "stock": 200,
            "description": "Susu terbaik",
            "CategoryId": 11,
            "createdAt": "2020-03-21T13:56:10.012Z",
            "updatedAt": "2020-03-21T13:56:10.012Z",
            "Category": {
              "id": 11,
              "name": "Drinks",
              "createdAt": "2020-03-21T13:55:42.487Z",
              "updatedAt": "2020-03-21T15:23:17.600Z"
            }
          },
          {
            "id": 14,
            "name": "Snickers",
            "image_url": "snickers.com",
            "price": 20000,
            "stock": 6,
            "description": "abcwe",
            "CategoryId": 12,
            "createdAt": "2020-03-21T14:10:35.413Z",
            "updatedAt": "2020-03-21T15:25:11.967Z",
            "Category": {
              "id": 12,
              "name": "Drugs",
              "createdAt": "2020-03-21T14:10:05.574Z",
              "updatedAt": "2020-03-23T15:53:35.975Z"
            }
          }
        ]
        ```

-   **Error Response:**

    -   **Code:** 500 INTERNAL SERVER ERROR <br />
        **Content:**
         ```json
        {
          "message": "Internal Server Error"
        }
        ```

## **Get Product**

  Returns json product

-   **URL**

    /product/:id

-   **Method:**

    `GET`

-   **URL Params**

    **Required:**

    `id=[integer]`

-   **Data Params**

     None

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        {
          "id": 15,
          "name": "Energen",
          "image_url": "abcd",
          "price": 20000,
          "stock": 30,
          "description": "Test",
          "CategoryId": 11,
          "createdAt": "2020-03-21T15:17:17.735Z",
          "updatedAt": "2020-03-21T15:17:17.735Z",
          "Category": {
            "id": 11,
            "name": "Drinks",
            "createdAt": "2020-03-21T13:55:42.487Z",
            "updatedAt": "2020-03-21T15:23:17.600Z"
          }
        }
        ```

-   **Error Response:**

    -   **Code:** 500 INTERNAL SERVER ERROR <br />
        **Content:**
        ```json
        {
          "message": "Internal Server Error"
        }
        ```

    -   **Code:** 404 NOT FOUND <br />
        **Content:**
        ```json
        {
          "errors": [
            "Product not found"
          ],
          "message": "Not found"
        }
        ```

## **Create Product**

  Returns json new product

- **Headers**

    Authorization: `<access_token>`

-   **URL**

    /product

-   **Method:**

    `POST`

-   **URL Params**

    None

-   **Data Params**

      **Required:**

      `name=[string]`\
      `image_url=[string]`\
      `price=[integer]`\
      `stock=[integer]`\
      `description=[string]`\
      `CategoryId=[integer]`



      ## Must use form data

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        {
          "id": 16,
          "name": "Beng Beng",
          "image_url": "benbg.com",
          "price": 2000,
          "stock": 200,
          "description": "Coklat",
          "CategoryId": 12
        }
        ```

-   **Error Response:**

    -   **Code:** 400 BAD REQUEST <br />
        **Content:**
        ```json
        {
          "errors": [
            "Product name is required",
            "Price is required",
            "Stock is required",
            "Description is required"
          ],
          "message": "Bad Request"
        }
        ```
        OR
        ```json
        {
          "errors": [
            "Price should be greater than or equal to 0"
          ],
          "message": "Bad Request"
        }
        ```
        OR
        ```json
        {
          "errors": [
            "Stock cannot be negative"
          ],
          "message": "Bad Request"
        }
        ```
   -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Please login first"
          ],
          "message": "Unauthorized"
        }
        ```
  -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Admin access required"
          ],
          "message": "Unauthorized"
        }
        ```

## **Update Product**

  Returns json updated product

- **Headers**

    Authorization: `<token>`

-   **URL**

    /product/:id

-   **Method:**

    `PUT`

-   **URL Params**

    None

-   **Data Params**

      **Required:**

      `name=[string]`\
      `image_url=[string]`\
      `price=[integer]`\
      `stock=[integer]`\
      `description=[string]`\
      `CategoryId=[integer]`

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        {
          "id": 16,
          "name": "Beng Beng",
          "image_url": "abc.com/123",
          "price": 2000,
          "stock": 50,
          "createdAt": "2020-03-23T19:25:38.860Z",
          "updatedAt": "2020-03-23T19:33:14.230Z",
          "description": "Coklat terbaik",
          "CategoryId": 11
        }
        ```

-   **Error Response:**

    -   **Code:** 400 BAD REQUEST <br />
        **Content:**
        ```json
        {
          "errors": [
            "Product name is required",
            "Price is required",
            "Stock is required",
            "Description is required"
          ],
          "message": "Bad Request"
        }
        ```
        OR
        ```json
        {
          "errors": [
            "Price should be greater than or equal to 0"
          ],
          "message": "Bad Request"
        }
        ```
        OR
        ```json
        {
          "errors": [
            "Stock cannot be negative"
          ],
          "message": "Bad Request"
        }
        ```
   -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Please login first"
          ],
          "message": "Unauthorized"
        }
        ```
  -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Admin access required"
          ],
          "message": "Unauthorized"
        }
        ```

  -   **Code:** 404 NOT FOUND <br />
      **Content:**
      ```json
      {
        "errors": [
          "Product not found"
        ],
        "message": "Not found"
      }
      ```

## **Delete Product**

  Returns json message deleted product

- **Headers**

    Authorization:  `<access_token>`

-   **URL**

    /product/:id

-   **Method:**

    `DELETE`

-   **URL Params**

    None

-   **Data Params**

      **Required:**

      `id=[integer]`

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        {
          "message": "Success deleting product 14"
        }
        ```

-   **Error Response:**

    -   **Code:** 404 NOT FOUND <br />
        **Content:**
        ```json
        {
          "errors": [
            "Product not found"
          ],
          "message": "Not found"
        }
        ```

  -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Admin access required"
          ],
          "message": "Unauthorized"
        }
        ```
   -   **Code:** 401 UNAUTHORIZED <br />
        **Content:**
        ```json
        {
          "errors": [
            "Please login first"
          ],
          "message": "Unauthorized"
        }
        ```

## **Login User**

Returns json access token and message

-   **URL**

    /user/login

-   **Method:**

    `POST`

-   **URL Params**

    None

-   **Data Params**

      **Required:**

      `email=[string]`\
      `password=[string]`

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:**
        ```json
        {
          "email": "admin@gmail.com",
          "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ5OTE0MDB9.Cy6k6HFOeqvtJgbGfo8c-2tGr2ab5J4RUUQyBsdVV-8"
        }
        ```

-   **Error Response:**
    -   **Code:** 400 BAD REQUEST <br />
        **Content:**
        ```json
        {
          "errors": [
            "Email or password is wrong"
          ],
          "message": "Unauthorized"
        }
        ```