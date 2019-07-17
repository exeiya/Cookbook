import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Comment, Header, Icon, Form, Button } from 'semantic-ui-react';
import { addComment } from '../reducers/recipeReducer';
import { notify } from '../reducers/notificationReducer';
import { openLoginModal } from '../reducers/loginModalReducer';

const RecipeComments = ({ recipe, loggedUser, addComment, notify, openLoginModal  }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => async (event) => {
    event.preventDefault();
    if (comment.length === 0) return;
    try {
      await addComment(recipe, comment);
      setComment('');
    } catch (e) {
      console.log(e);
      notify('Jotain meni vikaan. Uutta kommenttia ei luotu.', 'error');
      window.scrollTo(0, 0);
    }
  };

  const commentField = () => {
    if (!loggedUser) {
      return (
        <div style={{ marginTop: '30px', marginBottom: '20px' }}>
          Haluatko jättää kommentin?
          <span onClick={() => openLoginModal()}
            style={{ color: '#4183c4', cursor: 'pointer' }}> Kirjaudu sisään.
          </span>
        </div>
      );
    }

    return (
      <Form>
        <textarea
          value={comment}
          style={{ marginTop: '30px', marginBottom: '15px' }}
          onChange={({ target }) => setComment(target.value)} />
        <Button
          icon="edit"
          content="Lisää kommentti"
          color="teal"
          labelPosition="left"
          onClick={handleSubmit()} />
      </Form>
    );
  };

  const commentBox = (idx, comment) => {
    const bgcolor = idx % 2 === 0 ? '#ffffff' : '#e8fefe';
    return (
      <Comment key={comment._id} style={{ padding: '20px', backgroundColor: bgcolor }}>
        <Comment.Content>
          <Icon name="user" />
          <Comment.Author as={Link} to={`/users/${comment.user.id}`}>{comment.user.username}</Comment.Author>
          <Comment.Metadata>{new Date(comment.date).toLocaleString()}</Comment.Metadata>
          <Comment.Text>{comment.content}</Comment.Text>
        </Comment.Content>
      </Comment>
    );
  };

  const commentsToShow = () => {
    if (!recipe.comments || recipe.comments.length === 0) {
      return (
        <div style={{ padding: '20px' }}>Tällä reseptillä ei ole vielä kommentteja.</div>
      );
    }

    return recipe.comments.map((comment, idx) => commentBox(idx, comment));
  };

  return (
    <>
    <Comment.Group style={{ minWidth: '80%', marginTop: '50px' }}>
      <Header dividing>Kommentit</Header>
      {commentsToShow()}
      {commentField()}
    </Comment.Group>
    </>
  );
};

export default connect(
  state => ({
    loggedUser: state.loggedUser
  }),
  { addComment, notify, openLoginModal }
)(RecipeComments);