# key learnings #1

In the beginning of May 2024 I started my first internship as an AI Engineer.

It was a great experience and therefore I want to share the most usefull stuff I learned during the time.

My main task was the **optimization of hyperparameters** used in a NER task for anonymizing chat transcripts of a chat agent. But it turned out, that I had to optimize much more stuff than the hyperparameters.

### (1) Pay attention to the loss function of your model

What I've noticed is that a lot of big companies mostly pay attention to standard evaluation metrics such as accuracy, f1, recall etc. These values were really good, in general (99%+), but a massive problem was the train/val loss. Here is a little sketch how the loss function looked like: (can't publish the real plot, sorry)

// Insert picture here

As we can see, the loss functions looked very suspicious. To verify the correctness of the training loss function, you can compute the first value point manually. E.g., if you initialize your final layer correctly, you should measure $-\log \frac{1}{n_\text{classes}}$ on a softmax at initialization. The same default values can be derived for L2 regression, Huber losses, etc.
