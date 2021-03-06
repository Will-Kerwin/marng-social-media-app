import React, { useState } from "react";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import {
  DELETE_POST_MUTATION,
  FETCH_POSTS_QUERY,
  DELETE_COMMENT_MUTATION,
} from "../util/graphql";

function DeleteButton({ postId, commentId, callback }) {
  // sets state of the confirm overlay
  const [confirmOpen, setConfirmOpen] = useState(false);

  // because we can delete either comment or post this checks if commentId is given and decides which mutation to use
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  // useMutation hook
  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        //! this updates the cache so we are able to refresh posts without querying server
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((p) => p.id !== postId),
          },
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
    onError(err) {
      console.error(err);
    },
  });

  return (
    <>
      <Popup
        content={`Delete ${commentId ? "comment" : "post"}`}
        trigger={
          <Button
            as="div"
            color="red"
            onClick={() => setConfirmOpen(true)}
            floated="right"
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
        content="Are you sure you want to delete?"
      />
    </>
  );
}

export default DeleteButton;
