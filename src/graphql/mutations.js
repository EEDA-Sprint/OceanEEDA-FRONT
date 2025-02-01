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
  mutation MyMutation(
    $category: Category,
    $content: String,
    $regionId: String!,
    $title: String,
    $trashTypes: [String!],
    $poster: String,
    $latitude: Float!,
    $longitude: Float!,
    $files: [FileInput!]!
  ) {
    createMarking(
      input: {
        regionId: $regionId,
        category: $category,
        content: $content,
        trashTypes: $trashTypes,
        title: $title,
        poster: $poster,
        location: { latitude: $latitude, longitude: $longitude },
        files: $files,
        isApproved: false
      }
    ) {
      id
    }
  }
`;

export const MarkingUpdateWithDetails = gql`
  mutation UpdateMarking(
    $id: ID!,
    $category: Category,
    $content: String,
    $files: [FileInput!],
    $latitude: Float!,
    $longitude: Float!,
    $poster: String,
    $regionId: String,
    $title: String,
    $trashTypes: [String!]
  ) {
    updateMarking(
      id: $id,
      input: {
        category: $category,
        content: $content,
        files: $files,
        isApproved: false,
        location: { latitude: $latitude, longitude: $longitude },
        poster: $poster,
        regionId: $regionId,
        title: $title,
        trashTypes: $trashTypes
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

export const Refresh = gql`
  mutation Refresh($refreshToken: String!) {
    refresh(input: {refreshToken: $refreshToken}) {
      accessToken
      refreshToken
    }
  }
`

export const MarkingDelete = gql`
  mutation deleteMarking($id: ID!) {
    deleteMarking(id: $id) {
      id
    }
  }
`;
