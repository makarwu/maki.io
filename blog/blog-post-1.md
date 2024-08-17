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

-> Mostly through reading papers and AI forums. In our case, we trained a very deep transformer model on a small dataset (30k instances).

I stumbled over a paper called "Optimizing Deeper Transformers on Small Datasets" which was very helpful. They proposed some nice mathematical concepts, to avoid weird behavior of large models on small datasets.

One of the proposed methods was to apply **Xavier initialization** on all free parameters except loaded weights.

The initialization rule, which we apply to all weights, can be visualized as follows: \\[W^{[l]}\_{i,j} = \mathcal{N}\left(0,\frac{1}{n^{[l-1]}}\right)\\]

You can read more about that here: [Ch.4 CS230](https://cs230.stanford.edu/section/4/)

The result is that the variance of the activations are the same across every layer. This constant variance helps to prevent the gradients from exploding or vanishing.

Another way to tackle the exploding gradients problem is **Gradient Clipping**. The idea is pretty simple: If the gradient gets too large, we rescale it to keep it small. More precisely, if \\[||g|| \geq \tau \\], then
\\[ g \rightarrow \tau * \frac{g}{||g||}\\]
where \\(\tau\\) is a hyperparameter, g the gradient, and ||g|| the norm of g.

By that, we ensure that the gradient vector g has norm at most \\(\tau \\). Without clipping, the parameters take a huge descent step and leave the "good" region. With clipping, the descent step size is restricted and the parameters stay in the "good" region.

![](/assets/gclipping.png)

Another method which solved the loss problem was trying out many different optimizers (Adam, SGD etc.). Most of the time, Adam is pretty safe with a learning rate of 3e-4. But the optimal learning rate region is much more narrow and problem-specific. I've noticed that we used weight decay as a hyperparameter, but we unfortunetly didn't use it in an optimizer. That's why I decided to use **AdamW** and it worked pretty well! ML problems heavily depend on trying different combinations of parameters and optimizers.
