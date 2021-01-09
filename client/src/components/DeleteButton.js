import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import { DELETE_POST_MUTATION, FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({postId, callback}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
        setConfirmOpen(false)
        //! this updates the cache so we are able to refresh posts without querying server
        const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY
        });
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data:{
            getPosts: data.getPosts.filter(p => p.id !== postId)
        }})
        if(callback) callback();
    },
    variables: {
      postId
    }
  });

  return (
    <>
      <Button
        as="div"
        color="red"
        onClick={() => setConfirmOpen(true)}
        floated="right"
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePost}
        content="Are you sure you want to delete?"
      />
    </>
  );
}

export default DeleteButton;
