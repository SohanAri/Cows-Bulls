import game_logic 

CODE_LENGTH = 4  
MAX_ATTEMPTS = 10

POSSIBLE_DIGITS = [str(i) for i in range(10)]  # ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']


def get_player_guess(attempt_number):
    """
    Prompts the player for a guess and validates its format.
    Returns a list of strings (digits) if valid, otherwise None.
    """
    while True:
        guess_str = input(f"Attempt {attempt_number}/{MAX_ATTEMPTS} - Enter your {CODE_LENGTH}-digit guess: ")

        if len(guess_str) != CODE_LENGTH:
            print(f"Invalid input. Please enter exactly {CODE_LENGTH} digits.")
            continue
        if not guess_str.isdigit():
            print("Invalid input. Please enter only digits.")
            continue
        # Further validation: check if all digits are within POSSIBLE_DIGITS
        valid_digits = True
        for digit in guess_str:
            if digit not in POSSIBLE_DIGITS:
                print(f"Invalid digit: '{digit}'. Only use digits from {POSSIBLE_DIGITS[0]}-{POSSIBLE_DIGITS[-1]}.")
                valid_digits = False
                break
        if not valid_digits:
            continue

        return list(guess_str) # Convert the string guess to a list of characters


# update this function
def play_game():
    """Main function to run the Code Breaker game."""
    attempts_taken = 0
    secret_code = game_logic.generate_secret_code()

    while attempts_taken < MAX_ATTEMPTS:
        player_guess = get_player_guess(attempts_taken + 1)
        b, c = game_logic.calculate_feedback(secret_code, player_guess)
        print(f"Bulls: {b}, Cows: {c}")
        print("--------------------------------------------------------------------------------------")
        if b == CODE_LENGTH:
            print("Congratulations! You've cracked the code!")
            return
        attempts_taken += 1

    print("Game Over! You ran out of attempts.")
    print(f"The secret code was: {''.join(secret_code)}")

if __name__ == "__main__":
    play_game()
    