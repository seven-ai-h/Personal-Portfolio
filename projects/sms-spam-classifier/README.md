# SMS Spam Classification — Build Your Own Model

An end-to-end binary text-classification project: clean raw SMS text, engineer
interpretable features, train a logistic regression classifier, and evaluate it with
cross-validation, an ROC curve, and a confusion matrix.

**[📓 Open the notebook →](sms_spam_classification.ipynb)**

## Results

| Metric | Score |
| --- | --- |
| Validation accuracy | **97.9%** |
| 10-fold CV accuracy | 97.2% (±0.7%) |
| Precision | 0.96 |
| Recall | 0.88 |

## What's inside

- **Data cleaning** — lowercasing, label encoding, missing-value imputation
- **EDA** — keyword frequency by class, punctuation intensity, message-length distribution
- **Feature engineering** — `words_in_texts` keyword indicators plus punctuation count,
  message length, word count, and URL/number/currency flags
- **Modeling** — logistic regression with a reusable feature pipeline
- **Evaluation** — k-fold cross-validation, ROC curve + AUC, confusion matrix,
  and a coefficient plot showing which features drive the "spam" prediction

## Dataset

The public **SMS Spam Collection** (5,574 labeled English SMS messages), included at
`data/sms_spam.tsv`. The techniques transfer directly to email spam, review
moderation, and other binary text-classification tasks.

## Run it locally

```bash
pip install pandas scikit-learn matplotlib seaborn jupyter
jupyter notebook sms_spam_classification.ipynb
```

All code is original.
