import numpy as np
import matplotlib
import matplotlib.pyplot as plt

# Fixed constants
CO2_C = 0.0 # 1 - 371/371 
CO2_B = 0.19 # 1 - 299/371 
CO2_P = 0.91 # 1 - 33/371 

R = 0.2 # percent of bike racks per population
P_CAP = 46 # capacity of 1 bus
P_NUM = 830 # number of buses

class GovStrategy():
    def __init__(self, name, C_taxed = False, B_improved = False, P_improved = False):
        self.name = name
        self.C_taxed = C_taxed
        self.B_improved = B_improved
        self.P_improved = P_improved

    def get_payoff(self, C, B, P):
        if C >= 1 or B >= 1 or P >= 1:
            C /= 100
            B /= 100
            P /= 100

        saved_cost_B = (2*B) if (self.B_improved) else .1
        saved_cost_P = (P) if (self.P_improved) else .1

        tax = C + 0.1 if self.C_taxed else 0
        return 0.5*C*CO2_C + 2*B*CO2_B + 1*P*CO2_P + saved_cost_B + saved_cost_P + tax

    def __str__(self):
        return f'=====\nGov Strategy: {self.name}\n C_improved: {self.C_improved}\n B_improved: {self.B_improved}\n P_improved: {self.P_improved}\n=====\n' 

class SocietyStrategy():
    def __init__(self, C, B, P):
        self.name = f'({C}, {B}, {P})'
        self.C = C / 100
        self.B = B / 100
        self.P = P / 100

    def get_payoff(self, C_taxed = False, B_improved = False, P_improved = False):
        return self.B*self._SAT_B(B_improved)\
                + self.P*self._SAT_P(P_improved)\
                + self.C*self._SAT_C(C_taxed)

    def _SAT_B(self, improved_infrastructure: bool):
        B = self.B
        alpha, beta, k = .5, .1, 10
        utility_from_improvement = 11
        return alpha*(1 / (k*B + 1))\
                + beta*max(R*B, 0)\
                + (B*utility_from_improvement if improved_infrastructure else 0)

    def _SAT_P(self, improved_infrastructure: bool):
        P = self.P
        C = self.C
        alpha, beta, k = .1, .0001, 10
        utility_from_improvement = 10
        return alpha*(1 / (k*(P*P_CAP + C + 1)))\
                + beta*max(P*P_NUM*P_CAP, 0)\
                + (P*utility_from_improvement if improved_infrastructure else 0)

    def _SAT_C(self, C_taxed: bool):
        P = self.P
        C = self.C
        alpha, k = .1, .001
        v = P*P_NUM/P_CAP + C # proportional to number of vehicles on the road
        independence = 10 
        utility_from_taxation = -10
        return alpha*(1 / (k*v + 1))\
                + (C*independence)\
                + (C*utility_from_taxation if C_taxed else 0)

    def __str__(self):
        return '=====\nSociety Strategy\n C: {}\n B: {}\n P: {}\n=====\n'.format(self.C, self.B, self.P)

def generate_percentage_combinations():
    all_combinations = []
    for i in range(0, 101, 10):
        for j in range(0, 101-i, 10):
            for k in range(0, 101-i-j, 10):
                if i+j+k == 100:
                    all_combinations.append((i, j, k))
    return all_combinations

def generate_payoff_matrix(gov_strategies, society_strategies, normalize = True):
    payoff_matrix = [['' for _ in range(len(society_strategies))]\
                        for _ in range(len(gov_strategies))]

    gov_payoff_matrix = [[0 for _ in range(len(society_strategies))]\
                            for _ in range(len(gov_strategies))]
    society_payoff_matrix = [[0 for _ in range(len(society_strategies))]\
                                for _ in range(len(gov_strategies))]

    for row, gov_strategy in enumerate(gov_strategies):
        for col, society_strategy in enumerate(society_strategies):
            society_payoff = society_strategy.get_payoff(
                gov_strategy.C_taxed, 
                gov_strategy.B_improved, 
                gov_strategy.P_improved)
            gov_payoff = gov_strategy.get_payoff(
                society_strategy.C, society_strategy.B, society_strategy.P)

            gov_payoff_matrix[row][col] = gov_payoff
            society_payoff_matrix[row][col] = society_payoff
    
    gov_max = np.max(np.array(gov_payoff_matrix))
    society_max = np.max(np.array(society_payoff_matrix))

    for row in range(len(gov_strategies)):
        for col in range(len(society_strategies)):
            gov_payoff = gov_payoff_matrix[row][col] / (gov_max if normalize else 1)
            society_payoff = society_payoff_matrix[row][col] / (society_max if normalize else 1)
            payoff_matrix[row][col] = f'G: {gov_payoff:.3f}\nS: {society_payoff:.3f}'

    return payoff_matrix

def plot_payoff_matrix(gov_strategies, society_strategies, normalize = True):
    payoff_matrix = generate_payoff_matrix(
        gov_strategies, society_strategies, normalize=normalize)
    rows, cols = len(payoff_matrix), len(payoff_matrix[0])

    # Labels for x and y axes
    xlabels = [society_strategy.name for society_strategy in society_strategies]
    ylabels = [gov_strategy.name for gov_strategy in gov_strategies]

    fig, ax = plt.subplots()

    plt.rc('font', size=10)
    # plt.rc('xtick', labelsize=8)
    # plt.rc('ytick', labelsize=8)

    # Set ticks and tick labels for x and y axes
    ax.set_xticks(np.arange(cols) + 0.5, minor=False)
    ax.set_yticks(np.arange(rows) + 0.5, minor=False)
    ax.set_xticklabels(xlabels, minor=False)
    ax.set_yticklabels(ylabels, minor=False)
    ax.set_xlabel('Society Strategy (C: Cars, B: Bike, P: Public Bus)')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    ax.spines['left'].set_visible(False)

    # Add centered text to every square of the heatmap
    for i in range(len(ylabels)):
        for j in range(len(xlabels)):
            text_obj = ax.text(j + 0.5, i + 0.5, payoff_matrix[i][j],
                            ha="center", va="center", color="black")

    fig.set_size_inches(11.3, 3)
    fig.tight_layout()

    return fig, ax

if __name__ == '__main__':
    gov_strategies = [
        GovStrategy('Do Nothing', C_taxed=False, B_improved=False, P_improved=False),
        GovStrategy('Tax Gas', C_taxed=True, B_improved=False, P_improved=False),
        GovStrategy('Improve Bus Infrastructure', C_taxed=False, B_improved=False, P_improved=True),
        GovStrategy('Improve Bike Infrastructure', C_taxed=False, B_improved=True, P_improved=False),
    ]
    society_strategies = [
        SocietyStrategy(38,15,32),
        SocietyStrategy(33, 33, 33),
        SocietyStrategy(50, 50, 0),
        SocietyStrategy(50, 0, 50),
        SocietyStrategy(0, 50, 50),
        SocietyStrategy(100, 0, 0),
        SocietyStrategy(0, 100, 0),
        SocietyStrategy(0, 0, 100),
        # SocietyStrategy(*combo) for combo in generate_percentage_combinations()
    ]

    curr_pos = 0
    normalize = True
    fig, ax = plot_payoff_matrix(
        gov_strategies, 
        society_strategies[curr_pos: curr_pos + 11], 
        normalize=normalize)

    def key_event(e):
        global curr_pos, fig, ax

        if e.key == "right":
            curr_pos = (curr_pos + 11) % len(society_strategies)
        elif e.key == "left":
            curr_pos = (curr_pos - 11) % len(society_strategies)
        else:
            return
        
        print(f'plotting {curr_pos} to {curr_pos + 11}')

        ax.cla()
        plt.close(fig)

        fig, ax = plot_payoff_matrix(
            gov_strategies, 
            society_strategies[curr_pos: curr_pos + 11], 
            normalize=normalize)
        fig.canvas.mpl_connect('key_press_event', key_event)
        plt.show()

    fig.canvas.mpl_connect('key_press_event', key_event)
    plt.show()
