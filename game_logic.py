import random
def generate_secret_code():
    # Generate a list of digits 0-9, shuffle them, and take first 4 to ensure uniqueness
    digits = list('0123456789')
    random.shuffle(digits)
    return digits[:4]



def calculate_feedback(secret_code, player_guess):
    bulls = 0
    cows = 0
    unmatched_secret = []
    unmatched_guess = []

    # First pass: count bulls
    for i in range(4):
        if secret_code[i] == player_guess[i]:
            bulls += 1
        else:
            unmatched_secret.append(secret_code[i])
            unmatched_guess.append(player_guess[i])

    # Second pass: count cows using a frequency dictionary
    from collections import Counter
    secret_counter = Counter(unmatched_secret)

    for digit in unmatched_guess:
        if secret_counter[digit] > 0:
            cows += 1
            secret_counter[digit] -= 1

    return bulls, cows