const checkAuth = require("./check-auth");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const { SECRET_KEY } = require("../config");

let dataPath={};



const mockToken = jwt
  .sign(
    {
      id: "1134",
      email: "hi@hi.com",
      username: "test",
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  )
  .toString();

const mockExpiredToken = jwt
  .sign(
    {
      id: "1134",
      email: "hi@hi.com",
      username: "test",
    },
    SECRET_KEY,
    { expiresIn: "1s" }
  )
  .toString();

const authHeader = `Bearer ${mockToken}`;

describe("All check auth tests pass", () => {

  dataPath.req.headers.authorization=authHeader

  it("should return error if no header provided", () => {
    expect(checkAuth()).toEqual(
      new Error("Authorization header must be provided")
    );
  });

  it("should return error if invalid format", () => {
    expect(checkAuth(dataPath)).toEqual(
      new Error("Authentication token must be 'Bearer [token]'")
    );
  });

  it("should return authentication Error if invalid token", () => {
    expect(checkAuth(dataPath)).toEqual(
      new AuthenticationError("Invalid/expired token")
    );
  });

  it("should return user if all valid", () => {
    expect(checkAuth(dataPath)).objectContaining({
      id: expect.any(String),
      email: expect.any(String),
      username: expect.any(String),
    });
  });

  dataPath.req.headers.authorization=`Bearer ${mockExpiredToken}`

  it("should return authentication error if expired", () => {
      expect(checkAuth(dataPath)).objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        username: expect.any(String),
      }, 2000);
  });
});
