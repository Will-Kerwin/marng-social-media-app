import React, { useEffect, useState } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";

import {LIKE_POST_MUTATION} from "../util/graphql"

function LikeButton({ post: { id, likeCount, likes }, user }) {
  const [liked, setLiked] = useState(false);

  // if user has liked post then toggles display of button
  useEffect(() => {
    if (user && likes.find((like) => (like.username === user.username))) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  // useMutation hook
  const [likePost] = useMutation(LIKE_POST_MUTATION,{
      variables: {postId: id},
      onError(err){
          console.error(err);
      }
  })

  // sets markup for button depending on state redirects to login if unauthenticated
  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="teal" basic as={Link} to="/login">
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      {likeButton}
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

export default LikeButton;
