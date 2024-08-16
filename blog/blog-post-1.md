# key learnings #1

In the beginning of May 2024 I started my first internship as an AI Engineer.

My main task was the **optimization of hyperparameters** (Bayesian optimization) used in a NER task for anonymizing chat transcripts of a chat agent. But it turned out, that I had to optimize much more stuff than the hyperparameters.

It was a great experience and therefore I want to share the most usefull stuff I learned during the time.

### (1) Pay more attention to the loss functions of your model

What I've noticed is that a lot of big companies mostly analyze the standard evaluation metrics such as accuracy, f1, recall etc. logged by MLFlow. These values were really good, in general (99%+), but a massive problem was the train/val loss. Here is a little sketch how the loss function looked like: (can't publish the real plot, sorry :D)

![alt text](/assets/loss.jpg)

As we can see, the loss functions looked very suspicious. To verify the correctness of the training loss function, you can compute the first value point manually (red dot in the image). E.g., if you initialize your final layer correctly, you should measure: \\[-\log \frac{1}{n_\text{classes}} \\] on a softmax at initialization. The same default values can be derived for L2 regression, Huber losses, etc. Clearly, this was not the case in our situation.

This observation was an indicator, that there was some issue at the initialization of the layers, leading to not generalizing well on unseen data (overfitting).

So why do we want to optimize a model that doesn't work appropriately?

Before we start to optimize we should first question all the steps and requirements in our current process.

### (2) Make use of various mathematical concepts and read more papers!

How did I solve the loss issue?
