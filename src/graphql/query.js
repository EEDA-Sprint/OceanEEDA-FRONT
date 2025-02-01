import { gql } from "@apollo/client";

export const GetAllMarkings = gql`
    query AllMarkings {
        getAllMarkings {
            category
            isApproved
            id
            content
            title
            regionId
            poster
            createdAt
            location {
                latitude
                longitude
            }
            trashTypes
            userId
            files {
                name
                path
            }
        }
    }
`;

export const GetMyRole = gql`
    query MyQuery {
        getUserByCurrent {
            id
            role
            username
        }
    }
`;

