from django.shortcuts import render, get_object_or_404
from .models import Algorithm

def index(request):
    all_algorithms = Algorithm.objects.all()
    context = {
        'all_algorithms' : all_algorithms,
    }
    return render(request, 'algorithm/index.html', context)

def bigo(request):
    all_algorithms = Algorithm.objects.all()
    context = {
        'all_algorithms' : all_algorithms,
    }
    return render(request, 'algorithm/bigo.html', context)

def sort_detail(request, algorithm_id):
    all_algorithms = Algorithm.objects.all()
    algorithm = get_object_or_404(Algorithm, pk=algorithm_id)
    sort_prefix = "algorithm/" + str(algorithm)[:-5].lower()
    sort_code = sort_prefix + "_code.html"
    sort_status = sort_prefix + "_status.html"
    context = {
        'all_algorithms' : all_algorithms,
        'algorithm' : algorithm,
        'sort_code' : sort_code,
        'sort_status' : sort_status
    }

    #if algorithm_id == "1":
        #return bubble_sort(request, algorithm_id, algorithm, numbers)

    return render(request, 'algorithm/sort_detail.html', context)

def bubble_sort(request, algorithm_id):

    algorithm = get_object_or_404(Algorithm, pk=algorithm_id)
    numbers = [5,9,3,4,1]

    for i in range(len(numbers)):
        for j in range(len(numbers)-1-i):
            if numbers[j] > numbers[j+1]:
                numbers[j], numbers[j+1] = numbers[j+1], numbers[j]

    for n in numbers:
        print(n)

    context = {
        'algorithm' : algorithm,
        'numbers' : numbers
    }

    return render(request, 'algorithm/sort_detail.html', context)