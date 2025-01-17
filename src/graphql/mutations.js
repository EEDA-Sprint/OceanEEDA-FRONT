import { gql } from "@apollo/client";

export const SIGNIN = gql`
  mutation Signin($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

export const SIGNUP = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(input: { username: $username, email: $email, password: $password }) {
      id
    }
  }
`;

export const MarkingAdd = gql`
  mutation MarkingAdd(
    $regionId: String!,
    $category: Category!,
    $content: String!,
    $isApproved: Boolean!,
    $latitude: Float!,
    $longitude: Float!,
    $title: String!,
    $trashTypes: [String!]!,
    $poster: String!
  ) {
    createMarking(
      input: {
        regionId: $regionId,
        category: $category,
        content: $content,
        isApproved: $isApproved,
        location: {latitude: $latitude, longitude: $longitude},
        title: $title,
        trashTypes: $trashTypes,
        poster: $poster
      }
    ) {
      id
      isApproved
    }
  }
`;

export const MarkingUpdate = gql`
  mutation MyMutation($id: ID!, $isApproved: Boolean!) {
    updateMarking(id: $id, input: { isApproved: $isApproved }) {
      title
    }
  }
`;