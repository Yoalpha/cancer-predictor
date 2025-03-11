import pickle
pickle_model = pickle.load(open("model.pkl", "rb"))
predictions = pickle_model.predict([ [1000, 37, 1, 5, 1, 10, 4, 9, 2, 2, 6, 2, 4, 3, 2, 8, 70, 9, 2, 1, 4, 6, 3, 4] ])
predictions2 = pickle_model.predict([ [1000, 37, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 4, 3, 2, 1, 1, 1, 2, 1, 4, 6, 3, 4] ])
print(predictions, predictions2)